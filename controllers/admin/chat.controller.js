// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    _io.on("connection", (socket) => {
        console.log('a user connected', socket.id)
    })

    res.render("admin/page/chat/index",{
        pageTitle : "Trang Chat",
    })
}