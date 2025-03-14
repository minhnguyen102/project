const md5 = require("md5")
const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
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