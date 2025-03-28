const Account = require("../../models/accounts.model")

module.exports = async (res) =>{
    _io.once("connection", (socket) => {
        const myUserId = res.locals.user.id;
        socket.on("CLIENT_ADD_FRIEND", async (userId) =>{
            // A gửi kết bạn cho B

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

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            // A hủy lời mời đã gửi trước đó cho B
            //B1 : Xóa id của B trong requestFriends của A
            // console.log(myUserId); // id của A
            // console.log(userId); // id của B
            
            // check requestFriends của A có B chưa 
            const exitUserInRequestFriends = await Account.findOne({
                _id : myUserId,
                requestFriends : userId
            })
            
            if(exitUserInRequestFriends){
                await Account.updateOne(
                    {_id : myUserId},
                    {$pull : { requestFriends : userId}}
                )
            }
            //B2 : Xóa id của A trong acceptFriends của B
            const exitUserInAcceptFriends = await Account.findOne({
                _id : userId,
                acceptFriends : myUserId
            })
            
            if(exitUserInAcceptFriends){
                await Account.updateOne(
                    {_id : userId},
                    {$pull : { acceptFriends : myUserId}}
                )
            }
        })
    })
}