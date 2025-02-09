const homeRouter = require("./home.router")
const productsRouter = require("./product.router")

module.exports = (app) => {
    app.use("/", homeRouter)
    app.use("/products", productsRouter)
}