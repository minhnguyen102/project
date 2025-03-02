const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted : false
    })
    res.render("admin/page/roles/index.pug",{
        records : records
    })
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/page/roles/create.pug")
}

// [POST] /admin/roles/create
module.exports.createPost = (req, res) => {
    const role = new Role(req.body);
    role.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            _id : req.params.id,
            deleted : false
        }
    
        const record = await Role.findOne(find);
        res.render(`admin/page/roles/edit.pug`,{
            record : record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        let find = {
            _id : req.params.id,
            deleted : false
        }
        await Role.updateOne(find, req.body);
        req.flash("success", "Cập nhật thông tin quyền thành công")
    } catch (error) {
        req.flash("error", "Cập nhật thông tin quyền thất bại")
    }
    res.redirect(`back`)
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        let find = {
            _id : req.params.id,
            deleted : false
        }
        const record = await Role.findOne(find);
        console.log(record);
        res.render("admin/page/roles/detail.pug",{
            record : record
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async(req, res) => {
    let find = {
        _id : req.params.id,
        deleted : false
    }

    await Role.updateOne(
        find,
        {
            deleted : true, 
            deletedAt : new Date()
        });
    req.flash("success", "Xóa quyền thành công")
    res.redirect(`back`)
}