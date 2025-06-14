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

    // tạo ra một sự kiện
    _io.once("connection", (socket) =>{
        const myUserId = user.id;
        socket.broadcast.emit("SEVER_RETURN_ID_USER_ONLINE", myUserId);
    })

    // Khi đăng nhập : Lưu vào trong cookie 1 giá trị token của tài khoản
    res.cookie("token", user.token, {
        httpOnly: true // thêm để cho bên trình duyệt không lấy được, chỉ bên sever lấy được
    })
    await Account.updateOne(
        {_id : user.id},
        {statusOnline : "online"}
    )
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) =>{
    _io.once("connection", (socket) =>{
        const myUserId = res.locals.user.id;
        socket.broadcast.emit("SEVER_RETURN_ID_USER_OFFLINE", myUserId);
    })

    await Account.updateOne(
        {_id : res.locals.user.id},
        {statusOnline : "offline"}
    )

    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}
