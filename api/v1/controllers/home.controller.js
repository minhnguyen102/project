const Product = require("../../../models/product.model")
const productsHelper = require("../../../helpers/product")

// [GET] /home
module.exports.index = async (req, res) => {

    let find = {
        deleted : false,
        featured : "1",
        status : "active"
    }

    const productsFeatured = await Product.find(find).limit(6).select("-createBy -updateBy");
    const newProductsFeatured = productsHelper.priceNewProduct(productsFeatured);

    const productsNew = await Product.find({
        deleted : false,
        status : "active"
    }).sort({createdAt : "desc"}).limit(6).select("-createBy -updateBy")
    const newProductsNew = productsHelper.priceNewProduct(productsNew);

    res.json({
        code : 200,
        productsFeatured : newProductsFeatured,
        productsNew : newProductsNew
    })
}