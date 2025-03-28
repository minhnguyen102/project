const Account = require("../../models/accounts.model")
const Role = require("../../models/role.model")

const usersSocket = require("../../sockets/admin/users.socket")

// [GET] /admin/dashboard
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
    
    const users = await Account.find({
        $and : [
            {_id : {$ne : user_id}},
            { _id : {$nin : requestFriends}},
            { _id : {$nin : acceptFriends}},
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