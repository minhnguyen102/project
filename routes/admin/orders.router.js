const express = require('express'); 
const router = express.Router();

const controller = require('../../controllers/admin/orders.controller');

router.get('/', controller.index);

router.get('/detail/:orderId', controller.detail);

router.post('/accept', controller.acceptPost);

router.get('/accept', controller.accept);

module.exports = router; // cho phép các file khác được require