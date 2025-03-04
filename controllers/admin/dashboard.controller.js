// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    res.render("admin/page/dashboard/index",{
        pageTitle : "Trang dashboard",
    })
}