const mongoose = require('mongoose');
require("dotenv").config();

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_PORT);
        console.log("Connect Success");
    } catch (error) {
        console.log(error)
        console.log("Connect Error");
    }
}


