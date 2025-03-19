const express = require('express'); 
const router = express.Router();
const controller = require('../controllers/user.controller');
const validate = require("../../../validates/user/register.validate")


router.post('/register', validate.registerPost, controller.registerPost);

router.post('/login', validate.loginPost, controller.loginPost)

router.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost)

router.post('/password/otp', validate.otpPost, controller.otpPost)

router.post('/password/reset', validate.repassword, controller.resetPasswordPost)


module.exports = router; // cho phép các file khác được require