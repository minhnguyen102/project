const md5 = require("md5")
const User = require("../../../models/user.model")
const Cart = require("../../../models/cart.model")
const ForgotPassword = require("../../../models/forgotPassword.model")
const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendMail")

// [POST] /user/registerPost
module.exports.registerPost = async (req, res) => {

    const exisEmail = await User.findOne({
        email : req.body.email,
        deleted : false
    })
    if(exisEmail){
        res.json({
            code : 400,
            message : "Email đã tồn tại. vui lòng tạo tài khoản bằng email khác."
        })
        return;
    }

    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    // const tokenUser = user.tokenUser;
    // res.cookie("tokenUser", tokenUser)
    res.json({
        code : 200,
        message : "Đăng kí tài khoản thành công",
        // tokenUser : tokenUser
    })
}

// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email : email,
        deleted : false
    })

    if(!user){
        res.json({
            code : 400,
            message : "Tài khoản không tồn tại"
        })
        return;
    }
    if(md5(password) != user.password){
        res.json({
            code : 400,
            message : "Sai mật khẩu"
        })
        return;
    }
    if(user.status == "inactive"){
        res.json({
            code : 400,
            message : "Tài khoản hiện đang bị khóa"
        })
        return;
    }


    // Khi đăng nhập thành công thì tạo cho tài khoản một cart_id nếu chưa tồn tại
    let cartId = "";
    const cartExit = await Cart.findOne({
        user_id : user.id
    })
    if(!cartExit){
        const cart = new Cart({
            user_id : user.id
        })
        const timeExpire = 1000 * 60  * 60 * 24 * 365;
        res.cookie("cartId", cart.id, {
            expires : new Date(Date.now() + timeExpire)
        })
        await cart.save();
        cartId = cart.id;
    }else{
        cartId = cartExit.id;
        res.cookie("cartId", cartId)
    }
    // const cartId = cartExit.id;
    
    // const cart = await Cart.updateOne(
    //     {_id : req.cookies.cartId},
    //     {
    //         user_id : user.id
    //     }
    // )

    const tokenUser = user.tokenUser;
    res.cookie("tokenUser", tokenUser)
    res.json({
        code : 200,
        message : "Đăng nhập thành công",
        tokenUser : tokenUser,
        cartId : cartId,
        userName : user.fullName
    })
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login")
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email
    
    const user = await User.findOne({
        email : email,
        deleted : false
    })

    if(!user){
        res.json({
            code : 400,
            message : "Email không tồn tại. Vui lòng kiểm tra lại"
        })
        return;
    }

    // Bước 1 : Tạo ra mã otp và lưu vào database {mã otp, email}, lưu với thời gian nhất định
    const timeExpire = 5;
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email : email,
        otp : otp,
        expireAt : Date.now() + timeExpire*1000*60
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gửi otp qua mail cho người dùng 
    const subject = "Cấp mã OTP";
    const html = `Mã xác thực của bạn là : <b>${otp}</b>.Hết hạn trong thời gian 3 phút. Vui lòng không tiết lộ cho ai khác.`
    sendMailHelper.sendEmail(email, subject, html)

    res.json({
        code : 200,
        message : "Mã OTP đã được gửi đến email"
    })
}

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const checked = await ForgotPassword.findOne({
        email : email,
        otp : otp
    })

    if(!checked){
        res.json({
            code : 400,
            message : "Mã otp không hợp lệ"
        })
        return;
    }

    const user = await User.findOne({
        email : email
    })

    const tokenUser = user.tokenUser;
    res.cookie("tokenUser", tokenUser);
    
    res.json({
        code : 200,
        message : "Xác thực mã OTP thành công"
    })
}

// [post] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const newPassword = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
        {tokenUser : tokenUser},
        {password : md5(newPassword)}
    )
    res.json({
        code : 200,
        message : "Cập nhật mật khẩu thành công"
    })
}
