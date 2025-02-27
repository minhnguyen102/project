const ProductCategory = require("../../models/productsCategory.model")
const paginationHelper =  require("../../helpers/pagination")
const filterStatusHelper =  require("../../helpers/filterStatus")
const searchHelper =  require("../../helpers/search")

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
            limitItem : 5, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
            currentPage : 1,
        },
        req.query, totalRecords);
// End pagination

// Search 
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
// End Search 

    const records = await ProductCategory.find(find)
                                    .limit(objectPagination.limitItem)
                                    .skip(objectPagination.skip)

    res.render("admin/page/productsCategory/index",{
        records : records,
        filterStatus : filterStatus,
        objectSearch : objectSearch,
        objectPagination : objectPagination
    })
}

// [GET] /admin/products-category/create
module.exports.create = async(req, res) =>[
    res.render("admin/page/productsCategory/create")
]

// [POST] /admin/products-category/create
module.exports.createPost = async(req, res) =>{
    const productCategory = new ProductCategory(req.body);
    productCategory.save();
    res.redirect(`/admin/products-category`);
}



