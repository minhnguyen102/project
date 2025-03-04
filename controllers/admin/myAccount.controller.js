const Account = require("../../models/accounts.model")
const md5 = require("md5")
// [GET] /admin/my-account
module.exports.index = (req, res) =>{
    res.render("admin/page/my-account/index.pug",{
        pageTitle : "Trang thông tin cá nhân"
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) =>{
    res.render("admin/page/my-account/edit.pug",{
        pageTitle : "Trang chỉnh sửa thông tin cá nhân"
    })
}

// [POST] /admin/my-account/edit
module.exports.editPatch = async (req, res) =>{
    const id = res.locals.user.id;
    const email = req.body.email;
    const password = req.body.password
    let find = {
        _id : {$ne : id},
        email : email,
        deleted : false
    }
    const checkEmail = await Account.findOne(find);
    if(checkEmail){
        req.flash("error", "Email đã tồn tại");
    }else{
        if(!password){
            delete req.body.password;
        }else{
            req.body.password = md5(req.body.password);
        }
        await Account.updateOne({_id : id}, req.body)
        req.flash("success", "Cập nhật thông tin cá nhân thành công")
    }
    res.redirect("back");
}