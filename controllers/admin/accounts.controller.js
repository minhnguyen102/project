const Role = require("../../models/role.model")
const Account = require("../../models/accounts.model")
const md5 = require("md5")
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
// [GET] admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted : false
    }

//(Filter Status) Tính năng lọc trạng thái sản phẩm 
    if (req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query)
// End filerStatus

// Pagination
const totalAccount = await Account.countDocuments(find);
let objectPagination = paginationHelper(
    {
        limitItem : 2, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
        currentPage : 1,
    },
    req.query, totalAccount);
// End Pagination

// // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.email = objectSearch.regex;
    }
// // End Search : Cần tìm kiếm theo fullname or email chứ không còn là title


    const records = await Account.find(find).select("-password -token")
                                            .limit(objectPagination.limitItem)
                                            .skip(objectPagination.skip)
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
        records : records,
        filterStatus : filterStatus,
        objectPagination : objectPagination,
        keyword : objectSearch.keyword
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

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res)=>{
    let find = {
        _id : req.params.id,
        deleted : false
    }
    const record = await Account.findOne(find).select("-password -token");
    const roles = await Role.find({
        deleted : false
    })
    res.render("admin/page/accounts/edit.pug",{
        pageTitle : "Trang chỉnh sửa thông tin tài khoản",
        record : record,
        roles : roles
    })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id;
    let find = {
        _id : {$ne : id},
        deleted : false,
        email : req.body.email
    }
    const checkEmail = await Account.findOne(find);
    if(checkEmail){
        req.flash(`Email ${req.body.email} đã tồn tại`)
    }else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }
        await Account.updateOne({_id : id}, req.body);
        req.flash("success", "Cập nhật thành công");
    }
    res.redirect("back");
}

// [GET] admin/accounts/detail/:id
module.exports.detail = async (req, res)=>{
    let find = {
        _id : req.params.id,
        deleted : false
    }
    const account = await Account.findOne(find).select("-password -token");
    const roles = await Role.find({deleted : false})
    console.log(roles);
    res.render("admin/page/accounts/detail.pug",{
        pageTitle : "Trang chi tiết tài khoản",
        account : account,
        roles : roles
    })
}

// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req, res) =>{
    let find = {
        _id : req.params.id,
        deleted : false
    }
    await Account.updateOne(find, {deleted : true, deleteAt : new Date()})
    req.flash("success", "Xóa tài khoản thành công")
    res.redirect(`back`)
}