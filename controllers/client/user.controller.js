const md5 = require("md5")
const User = require("../../models/user.model")
// [GET] /user/register
module.exports.register = (req, res) => {
    res.render('client/pages/user/register', {
        pageTitle : "Trang đăng ký",
    });
}
// [POST] /user/registerPost
module.exports.registerPost = async (req, res) => {
    const exisEmail = await User.findOne({
        email : req.body.email
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