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

router.patch("/change-status/:status/:id", controller.changeStatus)

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validate.createPost,
    controller.editPatch)

router.get("/detail/:id", controller.detail)

router.delete("/delete/:id", controller.delete)

module.exports = router;