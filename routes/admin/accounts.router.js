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


module.exports = router