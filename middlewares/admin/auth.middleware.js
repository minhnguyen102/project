const Account = require("../../models/accounts.model")
const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")


module.exports.requireAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
        const user = await Account.findOne({
            token : token,
            deleted : false
        }).select("-password")
        if(user){
            const role = await Role.findOne({_id : user.role_id}).select("title permissions")
            // console.log(role)
            // console.log(user);
            res.locals.role = role;
            res.locals.user = user;
            next();
        }else{
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
    }
}