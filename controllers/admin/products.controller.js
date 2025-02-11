const Products = require("../../models/product.model")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Products.find({
        deleted : "false"
    })
    // console.log(products)
    res.render("admin/page/products/index.pug",{
        pageTitle : "Trang products",
        products : products
    })
}