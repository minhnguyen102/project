const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/chat.controller")
const charMiddleware = require("../../middlewares/admin/chat.middleware")

router.get("/:roomChatId", charMiddleware.accessChat, controller.index)

module.exports = router;