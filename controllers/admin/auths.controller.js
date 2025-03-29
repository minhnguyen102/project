const Account = require("../../models/accounts.model")
const md5 = require("md5");
const systemConfig = require("../../config/system")

// [GET] /admin/auth/login
module.exports.login = (req, res) =>{
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else{
        res.render("admin/page/auths/login.pug",{
            pageTitle : "Trang đăng nhập"
        })
    } 
}

// [POST] /admin/auth/login
module.exports.loginPost = async(req, res) =>{
    const email = req.body.email;
    const passrword = req.body.password;
    
    let find = {
        email : email,
        deleted : false
    }
    const user = await Account.findOne(find);

    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if(user.password != md5(passrword)){
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect("back");
        return;
    }

    // Khi đăng nhập : Lưu vào trong cookie 1 giá trị token của tài khoản
    res.cookie("token", user.token)
    await Account.updateOne(
        {_id : user.id},
        {statusOnline : "online"}
    )
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) =>{
    res.clearCookie("token");
    await Account.updateOne(
        {_id : res.locals.user.id},
        {statusOnline : "offline"}
    )
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}
