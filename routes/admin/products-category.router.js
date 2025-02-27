const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/productsCategory.controller")
const validate = require("../../validates/admin/productsCategory.validate")
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index)

router.get("/create", controller.create)

router.post(
    "/create", 
    upload.single('thumbnail'), 
    uploadCloud.uploadCloud,
    validate.createPost,
    controller.createPost)

module.exports = router;