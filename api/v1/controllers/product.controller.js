const Product = require("../../../models/product.model")
const ProductsCategory = require("../../../models/productsCategory.model")
const ProductsCategoryHelper = require("../../../helpers/products-category")
const productsHelper = require("../../../helpers/product")

// [GET] /products
module.exports.index = async (req, res) =>  {
    const products = await Product.find({
        status : "active"
    }).select("-updateBy -createBy");
    
    const newProducts = products.map(item => {
        item.newPrice = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
        return item;
    })

    res.json({
        code : 200,
        message : "Success",
        products : newProducts
    })
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) =>{
    // console.log(req.params.slugCategory);
    const productCategory = await ProductsCategory.findOne({
        slug : req.params.slugCategory,
        status : "active",
        deleted : false
    })

    // lấy ra danh sách id các thư mục con 
    const listCategory = await ProductsCategoryHelper.getSubCategory(productCategory.id);
    const listCategoryId = listCategory.map(item => item.id);

    // truy vấn các sản phẩm có product_category_id trong mảng id gồm có category truy vấn và con của nó 
    const products = await Product.find({
        product_category_id : { $in : [productCategory.id, ...listCategoryId]},
        deleted : false
    }).select("-createBy -updateBy")

    const newProducts = productsHelper.priceNewProduct(products);

    res.render('client/pages/products/index', {
        pageTitle : productCategory.title,
        products : newProducts
    });

    //api 
    // res.json(products);
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
        console.log(product);
    
        res.json({
            code : 200,
            message : "success",
            product : product
        })
    } catch (error) {
        res.json({
            code : 400,
            message : "error"
        })
    }
}