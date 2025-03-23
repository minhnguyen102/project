// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    res.render("admin/page/chat/index",{
        pageTitle : "Trang Chat",
    })
}