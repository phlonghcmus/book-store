const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/api/cartController');

router.get('/add-product',cartController.addProduct);
router.get('/decrease-product',cartController.decreaseProduct);
router.get('/remove-product',cartController.removeProduct);
router.get('/order',cartController.order)
module.exports = router;