const homeRouter = require("./home.router")
const productsRouter = require("./product.router")
const searchRouter = require("./search.router")
const cartRouter = require("./cart.router")
const checkoutRouter = require("./checkout.router")
const userRouter = require("./user.router")


const productsCategoryMiddleware = require("../../middlewares/clients/productsCategory.middleware.js")
const cartsMiddleware = require("../../middlewares/clients/carts.middleware.js")

module.exports = (app) => {

    app.use(productsCategoryMiddleware.productsCategory)

    app.use(cartsMiddleware.cardId)

    app.use("/", homeRouter)

    app.use("/products", productsRouter)
    
    app.use("/search", searchRouter)

    app.use("/cart", cartRouter)

    app.use("/checkout", checkoutRouter)

    app.use("/user", userRouter)
}