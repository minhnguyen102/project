const express = require("express")
const router = express.Router()
const controller = require("../../controllers/admin/products.controller")
const multer = require("multer");
const upload = multer()
const validates = require("../../validates/admin/product.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.delete("/delete/:id", controller.deleteItem )

router.get("/create", controller.create)

router.post(
  "/create",
  upload.single('thumbnail'), 
  uploadCloud.uploadCloud,
  validates.createPost,
  controller.createPost)

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validates.createPost,
    controller.editPatch)

router.get("/detail/:id", controller.detail)

router.get("/create-by/:id", controller.createBy)

router.get("/update-by/:id", controller.updateBy)

module.exports = router