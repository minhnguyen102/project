const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/product")

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

    res.render("client/pages/home/index",{
        pageTitle : "Trang chủ",
        productsFeatured : newProductsFeatured,
        newProductsNew : newProductsNew
    })

    // api
    // res.json(newProductsFeatured); // lay ra san pham noi bat 
    // res.json(newProductsNew); // lay ra san pham moi sắp xếp theo thơi gian
}