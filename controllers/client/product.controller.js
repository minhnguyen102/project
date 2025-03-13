const Product = require("../../models/product.model")
const ProductsCategory = require("../../models/productsCategory.model")
const ProductsCategoryHelper = require("../../helpers/products-category")
const productsHelper = require("../../helpers/product")

// [GET] /products
module.exports.index = async (req, res) =>  {
    const products = await Product.find({
        status : "active"
    }).select("-updateBy -createBy");
    
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    })

    // res.render("client/pages/products/index",{
    //     pageTitle : "Trang sản phẩm",
    //     products : newProducts
    // })

    // api
    // console.log(newProducts);
    res.json(newProducts);
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) =>{
    // console.log(req.params.slugCategory);
    const productCategory = await ProductsCategory.findOne({
        slug : req.params.slugCategory,
        status : "active",
        deleted : false
    })

    const listCategory = await ProductsCategoryHelper.getSubCategory(productCategory.id);
    const listCategoryId = listCategory.map(item => item.id);
    const products = await Product.find({
        product_category_id : { $in : [productCategory.id, ...listCategoryId]},
        deleted : false
    }).select("-createBy -updateBy")

    const newProducts = productsHelper.priceNewProduct(products);

    // res.render('client/pages/products/index', {
    //     pageTitle : productCategory.title,
    //     products : newProducts
    // });

    //api 
    res.json(products);
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
        product.priceNew = productsHelper.priceNew(product);
        // res.render("client/pages/products/detail",{
        //     product : product
        // })

        // api
        res.json(product);
    } catch (error) {
        res.redirect("/products")
    }
}