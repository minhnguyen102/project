const homeRouter = require("./home.router")
const productsRouter = require("./product.router")

const productsCategoryMiddleware = require("../../middlewares/clients/productsCategory.middleware.js")

module.exports = (app) => {
    
    app.use(productsCategoryMiddleware.productsCategory)

    app.use("/", homeRouter)
    app.use("/products", productsRouter)
}