const Products = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
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

    const products = await Products.find(find)
                            .limit(objectPagination.limitItem)
                            .skip(objectPagination.skip)

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
    await Products.updateOne({_id : id}, {status : status});
    res.redirect('back');
}

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
    console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    console.log(ids);
    switch(type){
        case "active":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set: {status : type} },
            )
            break;
        case "inactive":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set : {status : type} },
            )
            break;
        default:
            break;
    }

    res.redirect("back");
}