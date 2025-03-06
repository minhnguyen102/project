const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    product_category_id : {
        type : String,
        default : ""
    },
    slug:{
        type: String,
        slug: "title", // chuyển title thành slug
        unique: true
    },
    createBy : {
        account_id : String,
        createAt : {
            type : Date,
            default : Date.now
        }
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    deleted: {
        type : Boolean,
        default : false
    },
    deleteBy : {
        account_id : String,
        deleteAt : Date
    },
    updateBy : [
        {
            account_id : String,
            updateAt : Date
        }
    ]
},{timestamps : true}) // tự động thêm 2 trường thông tin là createdAt và updatedAt

const Product = mongoose.model("Product", productSchema, "products")
module.exports = Product;