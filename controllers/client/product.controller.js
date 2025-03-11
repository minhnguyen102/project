const Product = require("../../models/product.model")
// [GET] /products
module.exports.index = async (req, res) =>  {
    const products = await Product.find({
        status : "active"
    }).select("-updateBy -createBy");
    
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    })

    res.render("client/pages/products/index",{
        pageTitle : "Trang sản phẩm",
        products : newProducts
    })

    // api
    // console.log(newProducts);
    // res.json(newProducts);
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) =>{
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug : slug,
            deleted : false,
            status : "active"
        }).select("-updateBy -createBy")
        const priceNew  =  (product.price - product.price  * (product.discountPercentage / 100)).toFixed(0);
        product.priceNew = priceNew;
        res.render("client/pages/products/detail",{
            product : product
        })

        // api
        // res.json(product);
    } catch (error) {
        res.redirect("/products")
    }
}