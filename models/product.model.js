const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    slug:{
        type: String,
        slug: "title", // chuyển title thành slug
        unique: true
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type : Boolean,
        default : false
    },
    deleteAt: Date
},{timestamps : true}) // tự động thêm 2 trường thông tin là createdAt và updatedAt

const Product = mongoose.model("Product", productSchema, "products")
module.exports = Product;