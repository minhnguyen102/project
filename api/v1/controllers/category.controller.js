const ProductCategory = require("../../../models/productsCategory.model");
const createTreeHelper = require("../../../helpers/createTree2")

// module.exports.index = async (req, res) => {
//     let find = {
//         deleted: false
//     }
//     const productsCategory = await ProductCategory.find(find).lean();
//     console.log(productsCategory);
//     const newProductsCategory = createTreeHelper.tree(productsCategory);
//     res.json({
//         code : 200,
//         productsCategory : newProductsCategory
//     })
// }

module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false
        }
        const productsCategory = await ProductCategory.find(find).lean();
        
        // Log để kiểm tra dữ liệu
        console.log("Raw data from MongoDB:", JSON.stringify(productsCategory, null, 2));
        
        // Kiểm tra cấu trúc dữ liệu
        if (!Array.isArray(productsCategory)) {
            throw new Error("productsCategory is not an array");
        }
        
        const newProductsCategory = createTreeHelper.tree(productsCategory);
        
        // Log kết quả
        console.log("Processed tree:", JSON.stringify(newProductsCategory, null, 2));
        
        res.json({
            code: 200,
            productsCategory: newProductsCategory
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            code: 500,
            message: "Internal server error"
        });
    }
}