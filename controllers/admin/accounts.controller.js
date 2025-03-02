const Role = require("../../models/role.model")
const Account = require("../../models/accounts.model")
const md5 = require("md5")
const systemConfig = require("../../config/system")
// [GET] admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted : false
    }
    const records = await Account.find(find).select("-password -token")
    for (const record of records){
        const role = await Role.findOne(
            {
                _id : record.role_id,
                deleted : false
            }
        )
        record.role = role.title;
    }
    res.render("admin/page/accounts/index.pug",{
        pageTitle : "Trang danh sách tài khoản",
        records : records
    })
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {
    const records = await Role.find({
        deleted : false
    })
    res.render("admin/page/accounts/create.pug",{
        pageTitle : "Trang tạo mới tài khoản",
        records : records
    })
}

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {

    let find = {
        deleted : false,
        email: req.body.email
    }
    const checkEmail = await Account.findOne(find);
    if(checkEmail){
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
    }else{
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        req.flash('success', `Tạo tại khoản thành công`);
    }
    res.redirect(`back`);
}