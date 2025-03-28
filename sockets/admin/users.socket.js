const Account = require("../../models/accounts.model")

module.exports = async (res) =>{
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) =>{
            // A gửi kết bạn cho B
            const myUserId = res.locals.user.id;
            // console.log(myUserId); // id của A
            // console.log(userId); // id của B

            // thêm id của B vào requestFriends của A(Thêm nối vào)
            // kiểm tra xem ông B đã có trong request của ô A chưa 
            const exitUserFromPS = await Account.findOne({ // exitUserFromPersonSend
                _id : myUserId,
                requestFriends : userId
            })

            if(!exitUserFromPS){
                await Account.updateOne(
                    {_id : myUserId},
                    {$push : {requestFriends : userId}}
                )
            }
            // thêm id của A vào acceptFriends của B(thêm nối vào [..., idA])
            const exitUserFromPR = await Account.findOne({ //exitUserFromPersonReceive
                _id : userId,
                acceptFriends : myUserId
            })

            if(!exitUserFromPR){
                await Account.updateOne(
                    {_id : userId},
                    {$push : {acceptFriends : myUserId}}
                )
            }
        })
    })
}