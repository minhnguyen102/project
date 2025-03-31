const RoomChat = require("../../models/room-chat.model")

module.exports.accessChat = async (req, res, next) => {
    try {
        const user_id = res.locals.user.id;
        const roomChatId = req.params.roomChatId

        const accessChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": user_id,
            deleted: false
        })
        if (accessChat) {
            next();
        } else {
            res.redirect("/admin/dashboard")
        }
    } catch (error) {
        res.redirect("/admin/dashboard")
    }
}