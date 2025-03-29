const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/auths.controller")
const auth = require("../../middlewares/admin/auth.middleware")

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", auth.requireAuth, controller.logout);


module.exports = router