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
    const objectPagination = paginationHelper(req.query, totalProduct);
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