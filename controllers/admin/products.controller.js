const Products = require("../../models/product.model")
const ProductCategory = require("../../models/productsCategory.model")
const Account = require("../../models/accounts.model")
const Role = require("../../models/role.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/createTree")



// [GET] /admin/products
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

// Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
// End Search

// Pagination
    const totalProduct = await Products.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItem : 5, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
            currentPage : 1,
        },
        req.query, totalProduct);
// End Pagination

// Sort
    let sort = {}
    if(req.query.sortKey && req.query.valueKey){
        sort[req.query.sortKey] = req.query.valueKey;
    }else{
        sort.price = "asc";
    }
// End Sort

    const products = await Products.find(find)
                            .sort(sort)
                            .limit(objectPagination.limitItem)
                            .skip(objectPagination.skip)

    for(const product of products){
        const user = await Account.findOne({
            _id : product.createBy.account_id
        })
        if(user){
            product.accountFullname = user.fullname;
        }

        if(product.updateBy.length > 0){
            const userRecentUpdate = product.updateBy[product.updateBy.length - 1];
            const account_id = userRecentUpdate.account_id;
            const account = await Account.findOne({
                _id : account_id
            })
            if(account){
                product.updateFullname = account.fullname;
            }
        }
    }

    res.render("admin/page/products/index.pug",{
        pageTitle : "Trang products",
        products : products,
        filterStatus : filterStatus,
        keyword : objectSearch.keyword,
        objectPagination : objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updateBy = {
        account_id : res.locals.user.id,
        updateAt : new Date()
    }
    await Products.updateOne(
        {_id : id}, 
        {
            status : status,
            $push: {
                updateBy : updateBy
            }
        });
    req.flash("success", "Thay đổi trạng thái sản phẩm thành công")
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch(type){
        case "active":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set: {status : type} },
            )
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set : {status : type} },
            )
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set : {
                    deleted : true,
                    deleteBy : {
                        account_id : res.locals.user.id,
                        deleteAt : new Date()
                    }
                } },
            )
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        default:
            break;
    }
    res.redirect("back");
}
    
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Products.updateOne(
        {_id : id},
        {
            deleted : true,
            deleteBy :{
                account_id : res.locals.user.id,
                deleteAt : new Date()
            }
        }
    )
    req.flash("success", "Xóa sản phẩm thành công.")
    res.redirect("back");
} 

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.render('admin/page/products/create',{
        records: newRecords,
        pageTitle : "Trang tạo mới sản phẩm"
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Products.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
        account_id : res.locals.user.id
    }
    

    const product = new Products(req.body);
    product.save();


    res.redirect(`/admin/products`); // option trở lại trang sản phẩm
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Products.findOne({
            deleted : false,
            _id : id
        })

        const records = await ProductCategory.find({deleted: false});
        const newRecords = createTreeHelper.tree(records);

        res.render("admin/page/products/edit.pug",{
            product : product,
            records : newRecords,
            pageTitle : "Trang chỉnh sửa thông tin sản phẩmphẩm"
        })
    } catch (error) {
        res.redirect(`/admin/products`)
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) =>{
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    try {
        const updateBy = {
            account_id : res.locals.user.id,
            updateAt : new Date()
        }

        await Products.updateOne({
            _id : req.params.id,
            deleted : false
        }, {
            ...req.body,
            $push : { // đây là lệnh push vào trong mảng updateBy của model
                updateBy : updateBy
            }
        });
        req.flash("success", "Cập nhật thông tin sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thông tin sản phẩm thất bại");
    }
    res.redirect(`back`)
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) =>{
    try {
        const id = req.params.id;
        const product = await Products.findOne({
            _id : id,
            deleted : false
        })
        const productCategory = await ProductCategory.findOne({_id : product.product_category_id});
        res.render("admin/page/products/detail.pug", {
            product : product,
            productCategory : productCategory,
            pageTitle : "Trang thông tin chi tiết sản phẩm"
        })
    } catch (error) {
        res.redirect("/admin/products")
    }
}


// [GET] /admin/products/create-by/:id
module.exports.createBy = async (req, res) =>{
    const product_id = req.params.id;
    let find = {
        _id : product_id,
        deleted : false
    }
    const product = await Products.findOne(find)

    const account_id = product.createBy.account_id;
    const accountCreate = await Account.findOne(
        {_id : account_id,
        deleted : false
    }).select("fullname role_id")

    const roleAccount = await Role.findOne({
        _id : accountCreate.role_id
    }).select("title")

    console.log(product)
    res.render("admin/page/products/createBy",{
        product : product,
        infoAccount : {
            fullname : accountCreate.fullname,
            rolename : roleAccount.title
        }
    })
}

// [GET] /admin/products/update-by/:id
module.exports.updateBy = async (req, res) =>{
    const product_id = req.params.id;
    let find = {
        _id : product_id,
        deleted : false
    }
    const product = await Products.findOne(find)
    const objUpdate = product.updateBy[product.updateBy.length - 1];
    const account_id = objUpdate.account_id;

    const accountUpdate = await Account.findOne(
        {_id : account_id,
        deleted : false
    }).select("fullname role_id")

    const roleAccount = await Role.findOne({
        _id : accountUpdate.role_id
    }).select("title")

    res.render("admin/page/products/updateBy",{
        product : product,
        infoAccount : {
            fullname : accountUpdate.fullname,
            rolename : roleAccount.title,
            timeUpdate : objUpdate.updateAt
        }
    })
}
