const express = require('express'); 
const router = express.Router();

const controller = require('../../controllers/client/user.controller');
const validate = require("../../validates/user/register.validate")

router.get('/register', controller.register);

router.post('/register', validate.registerPost, controller.registerPost);

router.get("/login", controller.login)

router.post('/login',validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)

router.post('/password/forgot',validate.forgotPasswordPost, controller.forgotPasswordPost)

router.get('/password/otp', controller.otp)

router.post('/password/otp',validate.otpPost, controller.otpPost)

router.get('/password/reset-password', controller.resetPassword)

router.post('/password/reset-password',validate.repassword, controller.resetPasswordPost)


module.exports = router; // cho phép các file khác được require