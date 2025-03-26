const Chat = require("../../models/chat.model")
const Account = require("../../models/accounts.model")

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {

    const user_id = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    
    //SOCKET (once : tránh tạo kết nối mới nhiều lần sau khi load lại trang web)
    _io.once("connection", (socket) => {
        // console.log('a user connected', socket.id)
        socket.on("CLIENT_SEND_MESSAGE", async (content) =>{
            const chat = new Chat({
                user_id : user_id,
                content : content
            });
            await chat.save();

            // SERVER_RETURN_MESSAGE
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id : user_id,
                fullname : fullname,
                content : content
            })
        })

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                user_id : user_id,
                fullname : fullname,
                type : type
            })
        })
    })

    const chats = await Chat.find({
        deleted : false
    })
    
    for (const chat of chats) {
        const inforUser = await Account.findOne({
            _id : chat.user_id
        }).select("fullname")
        
        chat.inforUser = inforUser;
    }
    
    //END SOCKET
    res.render("admin/page/chat/index",{
        pageTitle : "Trang Chat",
        chats : chats
    })
}