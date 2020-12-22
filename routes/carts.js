const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const cartController = require('../controllers/cartController');

router.get('/',cartController.wishList);
router.get('/checkout',cartController.isCheckOut,ensureLoggedIn('/login'),cartController.checkOutPage);

module.exports = router;