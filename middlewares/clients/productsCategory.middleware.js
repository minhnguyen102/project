const ProductCategory = require("../../models/productsCategory.model");
const createTreeHelper = require("../../helpers/createTree")

module.exports.productsCategory =  async (req, res, next) => {
    let find = {
        deleted: false
    }
    const productsCategory = await ProductCategory.find(find);
    const newProductsCategory = createTreeHelper.tree(productsCategory);
    res.locals.productsCategory = newProductsCategory
    next();
}