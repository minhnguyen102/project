const Product = require("../../models/product.model")
const ProductHelper = require("../../helpers/product")

// [GET] /search
module.exports.index = async (req, res) =>{
    const keyword = req.query.keyword;
    let newProducts = []

    try {
        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");

            const products = await Product.find({
                title: keywordRegex,
                status: "active",
                deleted: false
            }).select("-createBy -updateBy");

            newProducts = ProductHelper.priceNewProduct(products);
            console.log(newProducts);
        }
        // res.render("client/pages/search/index", {
        //     pageTitle : "Trang kết quả tìm kiếm",
        //     keyword : keyword,
        //     products : newProducts
        // }) 

        // api 
        res.json(newProducts)
    } catch (error) {
        console.error("Error during product search:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}