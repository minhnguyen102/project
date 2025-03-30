const Account = require("../../models/accounts.model")
const RoomChat = require("../../models/room-chat.model")

module.exports = async (res) => {
    _io.once("connection", (socket) => {
        const myUserId = res.locals.user.id; // id của A
        //khi người dùng gửi lời mời kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            // A gửi kết bạn cho B

            // thêm id của B vào requestFriends của A(Thêm nối vào)
            // kiểm tra xem ông B đã có trong request của ô A chưa 
            const exitUserFromPS = await Account.findOne({ // exitUserFromPersonSend
                _id: myUserId,
                requestFriends: userId
            })

            if (!exitUserFromPS) {
                await Account.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                })
            }
            // thêm id của A vào acceptFriends của B(thêm nối vào [..., idA])
            const exitUserFromPR = await Account.findOne({ //exitUserFromPersonReceive
                _id: userId,
                acceptFriends: myUserId
            })

            if (!exitUserFromPR) {
                await Account.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            }

            // Lấy ra độ dài acceptFriends của B và chỉ trả về cho B
            const userB = await Account.findOne({
                _id: userId
            })
            const lengthAcceptFriendsOfB = userB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCPET_FRIEND", {
                userId: userId,
                lengthAcceptFriendsOfB: lengthAcceptFriendsOfB
            })
            // Hết Lấy ra độ dài acceptFriends của B và chỉ trả về cho B

            // Hiển thị A vào danh sách lời mời kết bạn của B
            const infoUserA = await Account.findOne({
                _id: myUserId
            }).select("id fullname avatar");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCPET_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
            // Hết Hiển thị A vào danh sách lời mời kết bạn của B

            // Xoá A khỏi danh sách not-friend của B
            socket.broadcast.emit("SERVER_RETURN_ID_USER_REMOVE_IN_NOTFRIEND", {
                userId: userId, // id cuar B để check chỉ B xóa
                myUserId: myUserId // id của A để xóa A,
            })
            // Hết Xoá A khỏi danh sách not-friend của B

        })
        // khi người dùng hủy gửi kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            // A hủy lời mời đã gửi trước đó cho B
            //B1 : Xóa id của B trong requestFriends của A
            // console.log(myUserId); // id của A
            // console.log(userId); // id của B

            // check requestFriends của A có B chưa 
            const exitUserInRequestFriends = await Account.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (exitUserInRequestFriends) {
                await Account.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                })
            }
            //B2 : Xóa id của A trong acceptFriends của B
            const exitUserInAcceptFriends = await Account.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (exitUserInAcceptFriends) {
                await Account.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                })
            }

            // A hủy yêu cầu => cập nhật lai số lượng bên B
            const userB = await Account.findOne({
                _id: userId
            })
            const lengthAcceptFriendsOfB = userB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_CANCEL_FRIEND", {
                userId: userId,
                lengthAcceptFriendsOfB: lengthAcceptFriendsOfB
            })

            // Khi hủy gửi yêu cầu => xóa A khỏi danh sách lời mời của B (realtime)
            // trả về id của A(để xóa A) và id của B(dể chỉ mình ông B xóa)
            socket.broadcast.emit("SERVER_RETURN_ID_USER_CANCEL_FRIEND", {
                userId: userId, // id cuả người nhận (B)
                myUserId: myUserId // id của người gửi (A)
            })
        })
        //khi người nhận từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            // A từ chối yêu cầu kết bạn được gửi đến từ B

            // console.log(myUserId); // id của A
            // console.log(userId); // id của B

            //B1 : Xóa id của A trong requestFriends của B
            // check requestFriends của A có B chưa 
            const exitUserInRequestFriends = await Account.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if (exitUserInRequestFriends) {
                await Account.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            }
            //B2 : Xóa id của B trong acceptFriends của A
            const exitUserInAcceptFriends = await Account.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if (exitUserInAcceptFriends) {
                await Account.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                })
            }
        })
        // khi người nhận đồng ý kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // A chấp nhận B
            // kiểm tra sự tồn tại của nhau
            const exitUserInAcceptFriends = await Account.findOne({
                _id: myUserId, // id A
                acceptFriends: userId // id B
            })
            const exitUserInRequestFriends = await Account.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            // tạo room chat
            let roomChat;

            if (exitUserInAcceptFriends && exitUserInRequestFriends) {
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        },
                        {
                            user_id: userId,
                            role: "superAdmin"
                        }
                    ]
                })
                await roomChat.save();
            }

            // thêm id của B trong listFriend của A
            // Xóa id của B trong acceptFriends của A
            if (exitUserInAcceptFriends) {
                await Account.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                })
            }
            // thêm id của A trong listFriend của B
            // Xóa id của A trong requestFriends của B

            if (exitUserInRequestFriends) {
                await Account.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            }
        })
    })
}