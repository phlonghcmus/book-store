const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/api/cartController');

router.get('/add-cart',cartController.addCart);

module.exports = router;