const ProductCategory = require("../../models/productsCategory.model")
const paginationHelper =  require("../../helpers/pagination")

// [GET] /admin/products-category
module.exports.index = async (req, res) =>{
    let find = {
        deleted : false
    }
// pagination
    const totalProduct = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItem : 3, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
            currentPage : 1,
        },
        req.query, totalProduct);
// End pagination

    const records = await ProductCategory.find(find)
                                    .limit(objectPagination.limit)
                                    .skip(objectPagination.skip)

    res.render("admin/page/productsCategory/index",{
        records : records,
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



