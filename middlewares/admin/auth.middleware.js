const Account = require("../../models/accounts.model")
const systemConfig = require("../../config/system")


module.exports.requireAuth = async (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }else{
        const user = await Account.findOne({
            token : token,
            deleted : false
        })
        if(user){
            next();
        }else{
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
    }
}