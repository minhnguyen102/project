const Account = require("../../models/accounts.model")
const Role = require("../../models/role.model")

const usersSocket = require("../../sockets/admin/users.socket")

// [GET] /admin/user/not-friend
module.exports.notFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const user_id = res.locals.user.id;
    const myUser = await Account.findOne({
        _id : user_id
    })

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id)
    
    const users = await Account.find({
        $and : [
            {_id : {$ne : user_id}},
            { _id : {$nin : requestFriends}},
            { _id : {$nin : acceptFriends}},
            { _id : {$nin : friendListId}},
        ],
        status : "active",
        deleted : false
    })
    // console.log(users);
    for (const user of users) {
        const role_id = user.role_id
        const roleName = await Role.findOne({
            _id : role_id
        }).select("title")
        user.roleName = roleName
    }

    res.render("admin/page/users/not-friend",{
        pageTitle : "Trang danh sách người dùng",
        users : users
    })
}
// [GET] /admin/user/request
module.exports.request = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const myUserId = res.locals.user.id;
    const myUser = await Account.findOne({
        _id : myUserId
    })
    const requestFriends = myUser.requestFriends;

    const usersRequest = await Account.find({
        _id : { $in : requestFriends },
        status : "active",
        deleted : false
    }).select("fullname avatar id")

    res.render("admin/page/users/request",{
        pageTitle : "Lời mời đã gửi ",
        usersRequest : usersRequest
    })
}

// [GET] /admin/user/accept
module.exports.accept = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const user_id = res.locals.user.id;
    const myUser = await Account.findOne({
        _id : user_id
    })

    // const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    
    const users = await Account.find({
        _id : {$in : acceptFriends},
        status : "active",
        deleted : false
    }).select("fullname avatar id")

    res.render("admin/page/users/accept",{
        pageTitle : "Lời mời kết bạn",
        users : users
    })
}

// [GET] /admin/user/friends
module.exports.friends = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const user_id = res.locals.user.id;
    const myUser = await Account.findOne({
        _id : user_id
    })

    // const requestFriends = myUser.requestFriends;
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id)
    
    const users = await Account.find({
        _id : {$in : friendListId},
        status : "active",
        deleted : false
    }).select("fullname avatar id statusOnline")


    // mục đích là trong mỗi object của user thuộc mảng users có thêm 1 trường roomchatid => cần lặp qua users
    // Lấy thông tin room chat id ở đâu ? => ở trong friendList => friendList.find
    users.forEach(user => {
        const infoUser = friendList.find(item => item.user_id == user.id);
        user.room_chat_id = infoUser.room_chat_id
    });

    res.render("admin/page/users/friends",{
        pageTitle : "Danh sách bạn bè",
        users : users
    })
}