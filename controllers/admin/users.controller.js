const Account = require("../../models/accounts.model")
const Role = require("../../models/role.model")

// [GET] /admin/dashboard
module.exports.notFriend = async (req, res) => {
    const user_id = res.locals.user.id;
    const users = await Account.find({
        _id : {$ne : user_id},
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