const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController=require('../controllers/userController');
/* GET list of books. */
router.get('/', homeController.index);
router.get('/login', userController.login);
router.get('/signup', userController.signup);

module.exports = router;
