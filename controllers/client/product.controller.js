const Product = require("../../models/product.model")
// [GET] /products
module.exports.index = async (req, res) =>  {
    const products = await Product.find({
        status : "active"
    });
    
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    })

    res.render("client/pages/products/index",{
        pageTitle : "Trang sản phẩm",
        products : newProducts
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) =>{
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug : slug,
            deleted : false
        })
        res.render("client/pages/products/detail",{
            product : product
        })
    } catch (error) {
        res.redirect("/products")
    }
}