const express = require("express")
const router = express.Router()
const controller = require("../../controllers/admin/products.controller")
const multer = require("multer");
const upload = multer()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const validates = require("../../validates/admin/product.validate")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET 
});


router.get("/", controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.delete("/delete/:id", controller.deleteItem )

router.get("/create", controller.create)

router.post(
    "/create",
    upload.single('thumbnail'), 
    function (req, res, next) {
      if(req.file){
          let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.url;
            console.log(req.body[req.file.fieldname]);
            next();
        }
        upload(req);
      }else{
        next();
      }
      
  },
  validates.createPost,
  controller.createPost)

router.get("/edit/:id", controller.edit)

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validates.createPost,
    controller.editPatch)

router.get("/detail/:id", controller.detail)

module.exports = router