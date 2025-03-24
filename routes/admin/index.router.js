const system = require("../../config/system")
const dashboardRouter = require("./dashboard.router")
const productsRouter = require("./products.router")
const productsCategoryRouter = require("./products-category.router");
const rolesRouter = require("./roles.router")
const accountsRouter = require("./accounts.router")
const authsRouter = require("./auths.router")
const myAccountRouter = require("./my-account.router")
const orderRoutes = require("./orders.router");
const chatRoutes = require("./chat.router");

const auth = require("../../middlewares/admin/auth.middleware")

module.exports = (app) =>{
    const PATH_ADMIN = system.prefixAdmin;
    // app.use("admin" + "/dashboard", dashboardRouter) dùng biến lưu trữ pathAdmin, phòng khi chỉnh sửa thì chỉ cần chỉnh 1 chỗ 
    app.use(PATH_ADMIN + "/dashboard", auth.requireAuth, dashboardRouter)
    app.use(PATH_ADMIN + "/products", auth.requireAuth, productsRouter)
    app.use(PATH_ADMIN + "/products-category", auth.requireAuth, productsCategoryRouter)
    app.use(PATH_ADMIN + "/roles", auth.requireAuth, rolesRouter)
    app.use(PATH_ADMIN + "/accounts", auth.requireAuth, accountsRouter)
    app.use(PATH_ADMIN + "/auth", authsRouter)
    app.use(PATH_ADMIN + "/my-account", auth.requireAuth, myAccountRouter)
    app.use(PATH_ADMIN + '/orders', auth.requireAuth, orderRoutes);
    app.use(PATH_ADMIN + '/chat', auth.requireAuth, chatRoutes);
}

 
