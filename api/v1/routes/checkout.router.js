const express = require('express'); 
const router = express.Router();

const controller = require('../controllers/checkout.controller');
const validate = require("../../../validates/user/register.validate")

router.get('/', controller.index);

router.post('/order', validate.checkout , controller.order);

router.get('/success/:orderId', controller.success);

module.exports = router; 