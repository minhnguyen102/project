const mongoose = require("mongoose")
const generateHelper = require("../helpers/generate")

const accountSchema = new mongoose.Schema({
    fullname : String,
    email : String,
    password : String,
    token : {
        type : String,
        default : generateHelper.generateRandomString(20)
    },
    avatar : String,
    role_id : String,
    status : String,
    deleted : {
        type : Boolean,
        default : false
    },
    deleteAt : Date
},{timestamps : true})

const Account = mongoose.model("Account", accountSchema, "accounts")
module.exports = Account;