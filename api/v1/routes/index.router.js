const homeRouter = require("./home.router")
const productRouter = require("./products.router")
const searchRouter = require("./search.router")
const userRouter = require("./user.router")
const cartRouter = require("./cart.router")
const checkoutRouter = require("./checkout.router")

const middlewareAuth = require("../middlewares/auth.middleware")

module.exports = (app) => {

    const version = "/api/v1"

    app.use(version + "/", homeRouter)

    app.use(version + "/products", productRouter)

    app.use(version + "/search", searchRouter)

    app.use(version + "/user", userRouter)

    app.use(version + "/cart", middlewareAuth.requireAuth, cartRouter)

    app.use(version + "/checkout", middlewareAuth.requireAuth, checkoutRouter)
}