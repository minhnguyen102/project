const Chat = require("../../models/chat.model")
const Account = require("../../models/accounts.model")
const RoomChat = require("../../models/room-chat.model")

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId;

    // SOCKET
    const user_id = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    //SOCKET (once : tránh tạo kết nối mới nhiều lần sau khi load lại trang web)
    _io.once("connection", (socket) => {
        // console.log('a user connected', socket.id)
        socket.on("CLIENT_SEND_MESSAGE", async (content) =>{
            socket.join(roomChatId);
            const chat = new Chat({
                user_id : user_id,
                room_chat_id : roomChatId,
                content : content
            });
            await chat.save();

            // SERVER_RETURN_MESSAGE
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                user_id : user_id,
                fullname : fullname,
                content : content
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                user_id : user_id,
                fullname : fullname,
                type : type
            })
        })
    })
    //END SOCKET
    const chats = await Chat.find({
        deleted : false,
        room_chat_id : roomChatId
    })
    
    for (const chat of chats) {
        const inforUser = await Account.findOne({
            _id : chat.user_id
        }).select("fullname")
        
        chat.inforUser = inforUser;
    }

    const userInRomchat = await RoomChat.findOne({
        _id : roomChatId
    }).select("users")
    const idUserContact = userInRomchat.users.find(item => item.user_id != user_id)

    const userContact = await Account.findOne({
        _id : idUserContact.user_id
    }).select("fullname")

    res.render("admin/page/chat/index",{
        pageTitle : "Trang Chat",
        chats : chats,
        fullnameContact : userContact.fullname
    })
}