const Product = require("../../../models/product.model")
const ProductHelper = require("../../../helpers/product")

// [GET] /search
module.exports.index = async (req, res) => {
    if (req.query.keyword) {
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
            }
            // api 
            res.json({
                code: 200,
                message: "success",
                product: newProducts
            })
        } catch (error) {
            res.json({
                code: 400,
                message: "Không tìm thấy sản phẩm"
            })
            return;
        }
    }else{
        res.json({
            code: 400,
            message: "Bạn cần nhập thông tin vào ô tìm kiếm"
        })
        return;
    }

}