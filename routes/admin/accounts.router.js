const express = require("express")
const router = express.Router()
const multer = require('multer');
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const validate = require("../../validates/admin/account.validate")

const controller = require("../../controllers/admin/accounts.controller")

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("avatar"),
    uploadCloud.uploadCloud,
    validate.createPost,
    controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.uploadCloud,
    validate.editPatch,
    controller.editPatch);

router.get("/detail/:id", controller.detail)

router.delete("/delete/:id", controller.delete)


module.exports = router