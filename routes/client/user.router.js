const express = require('express'); 
const router = express.Router();

const controller = require('../../controllers/client/user.controller');
const validate = require("../../validates/user/register.validate")

router.get('/register', controller.register);
router.post('/register', validate.registerPost, controller.registerPost);

module.exports = router; // cho phép các file khác được require