const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

// [GET] /home
module.exports.index = async (req, res) => {

    let find = {
        deleted : false,
        featured : "1",
        status : "active"
    }

    const productsFeatured = await Product.find(find).limit(6).select("-createBy -updateBy");
    const newProductsFeatured = productHelper.priceNewProduct(productsFeatured);
    res.render("client/pages/home/index",{
        pageTitle : "Trang chủ",
        productsFeatured : newProductsFeatured
    })

    // api
    // res.json(newProductsFeatured); // lay ra san pham noi bat 
}