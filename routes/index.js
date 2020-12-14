const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController=require('../controllers/userController');
const passport=require('../middleware/passport/passport');
/* GET list of books. */
router.get('/', homeController.index);
router.get('/login', userController.login);
router.get('/signup', userController.signup);
router.get('/contact', homeController.contact);
router.get('/about', homeController.about);
router.post('/signup/success',userController.signupSuccess);
router.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/books',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

router.get('/recover-account',userController.recoverPage);
module.exports = router;
