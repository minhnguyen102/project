const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/auths.controller")

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);


module.exports = router