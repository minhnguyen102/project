const ProductCategory = require("../../models/productsCategory.model")
const paginationHelper =  require("../../helpers/pagination")
const filterStatusHelper =  require("../../helpers/filterStatus")
const searchHelper =  require("../../helpers/search")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index = async (req, res) =>{
    let find = {
        deleted : false
    }

// filterStatus
    if(req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query);
// End filterStatus

// pagination
    const totalRecords = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItem : 7, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
            currentPage : 1,
        },
        req.query, totalRecords);
// End pagination

// Search 
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    const keyword = objectSearch.keyword;
// End Search 

    const records = await ProductCategory.find(find)
                                    .limit(objectPagination.limitItem)
                                    .skip(objectPagination.skip)
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/page/productsCategory/index",{
        records : newRecords,
        filterStatus : filterStatus,
        objectSearch : objectSearch,
        keyword : keyword,
        objectPagination : objectPagination
    })
}

// [GET] /admin/products-category/create
module.exports.create = async(req, res) =>{
    let find = {
        deleted : false
    }
    
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/page/productsCategory/create",{
        records : newRecords
    })
}

// [POST] /admin/products-category/create
module.exports.createPost = async(req, res) =>{
    const productCategory = new ProductCategory(req.body);
    productCategory.save();
    res.redirect(`/admin/products-category`);
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await ProductCategory.updateOne(
        {_id : id},
        {status : status}
    )
    req.flash("success", "Thay đổi trạng thái danh mục sản phẩm thành công")
    res.redirect("back")
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async(req, res) =>{
    try {
        let find = {
            deleted: false,
            _id: req.params.id
        }
        const records = await ProductCategory.find({deleted : false});
        const newRecords = createTreeHelper.tree(records);
        const data = await ProductCategory.findOne(find);
        res.render('admin/page/productsCategory/edit', {
            pageTitle: "Trang chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect("/admin/products-category")
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async(req, res)=>{
    try {
        await ProductCategory.updateOne({_id : req.params.id, deleted : false}, req.body);
        req.flash("success", "Cập nhật thông tin danh mục sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thông tin danh mục sản phẩm thất bại")
    }
    res.redirect(`back`)
}

// // [GET] /admin/products-category/detail/:id
module.exports.detail = async(req, res) => {
    const id = req.params.id;
    const record = await ProductCategory.findOne({
        _id : id,
        deleted : false
    })
    res.render("admin/page/productsCategory/detail", {
        pageTitle : "Trang chi tiết danh mục sản phẩm",
        record : record
    })
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async(req, res) =>{
    const id = req.params.id;
    await ProductCategory.updateOne(
        {_id : id},
        {
            deleted : true,
            deletedAt : new Date()
        }
    )
    req.flash("success", "Xóa sản phẩm thành công");
    res.redirect(`back`);
}




