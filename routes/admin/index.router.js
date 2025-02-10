const system = require("../../config/system")
const dashboardRouter = require("./dashboard.router")

module.exports = (app) =>{
    const PATH_ADMIN = system.prefixAdmin;
    // app.use("admin" + "/dashboard", dashboardRouter) dùng biến lưu trữ pathAdmin, phòng khi chỉnh sửa thì chỉ cần chỉnh 1 chỗ 
    app.use(PATH_ADMIN + "/dashboard", dashboardRouter)
}


