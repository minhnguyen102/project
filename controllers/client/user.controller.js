const md5 = require("md5")
const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
const ForgotPassword = require("../../models/forgotPassword.model")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")

// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register', {
        pageTitle : "Trang đăng ký",
    });
}
// [POST] /user/registerPost
module.exports.registerPost = async (req, res) => {
    const exisEmail = await User.findOne({
        email : req.body.email,
        deleted : false
    })
    if(exisEmail){
        req.flash('error', `Email đã tồn tại. Vui lòng đăng ký bằng email khác`);
        res.redirect(`back`);
        return;
    }

    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        pageTitle : "Trang đăng nhập",
    });
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
        req.flash('error', `Email không tồn tại.`);
        res.redirect(`back`);
        return;
    }
    if(md5(password) != user.password){
        req.flash('error', `Mật khẩu không đúng.`);
        res.redirect(`back`);
        return;
    }
    if(user.status == "inactive"){
        req.flash('error', `Tài khoản đã bị tạm khóa.`);
        res.redirect(`back`);
        return;
    }

    const cart = await Cart.updateOne(
        {_id : req.cookies.cartId},
        {
            user_id : user.id
        }
    )

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login")
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot-password', {
        pageTitle : "Trang quên mật khẩu",
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({
        email : email,
        deleted : false
    })

    if(!user){
        req.flash('error', `Email không tồn tại`);
        res.redirect(`back`);
        return;
    }

    // Bước 1 : Tạo ra mã otp và lưu vào database {mã otp, email}, lưu với thời gian nhất định
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email : email,
        otp : otp,
        expireAt : Date.now()
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gửi otp qua mail cho người dùng 
    const subject = "Cấp mã OTP";
    const html = `Mã xác thực của bạn là : <b>${otp}</b>.Hết hạn trong thời gian 3 phút. Vui lòng không tiết lộ cho ai khác.`
    sendMailHelper.sendEmail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email;
    res.render('client/pages/user/otp', {
        pageTitle : "Trang nhập otp",
        email : email
    });
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
        req.flash("error", "Mã otp không hợp lệ");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email : email
    })

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset-password")
}

// [GET] /user/password/reset-password
module.exports.resetPassword =  (req, res) => {
    res.render('client/pages/user/reset-password', {
        pageTitle : "Trang khôi phục mật khẩu",
    });
}

// [post] /user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
    const newPassword = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
        {tokenUser : tokenUser},
        {password : md5(newPassword)}
    )
    req.flash("success", "Đổi mật khẩu thành công")
    res.redirect("/")
}
