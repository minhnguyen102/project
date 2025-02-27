const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,
    parent: {
        type: String,
        default : ""
    },
    slug: {
        type: String,
        slug: "title",
        unique: true // tránh trùng slug
    },
    description: String,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type : Boolean,
        default : false
    },
    deletedAt : Date
},{ timestamps: true });

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category");

module.exports = ProductCategory;