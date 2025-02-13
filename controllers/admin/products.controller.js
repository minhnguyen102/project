const Products = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
// [GET] /admin/products
module.exports.index = async (req, res) => {

    let find = {
        deleted : false
    }

//(Filter Status) Tính năng lọc trạng thái sản phẩm 
    // Nếu tồn tại query status 
    if (req.query.status){
        find.status = req.query.status;
    } /* <=> find {
            deleted : false,
            status : ["active" - "inactive" - ""]
        }*/
    const filterStatus = filterStatusHelper(req.query)
// End filerStatus

// Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
// End Search

    const products = await Products.find(find)

    
    res.render("admin/page/products/index.pug",{
        pageTitle : "Trang products",
        products : products,
        filterStatus : filterStatus,
        keyword : objectSearch.keyword
    })
}