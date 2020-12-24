const express = require('express');
const router = express.Router();
const userController=require('../controllers/userController');
const multer  = require('multer');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

const upload = multer({ dest: 'public/uploads/' ,fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }})
/* GET users listing. */
router.get('/profile',userController.profile);
router.post('/profile/update',upload.single('file-avatar'),userController.profileUpdate);
router.get('/verification/:id',userController.verification);
router.get('/logout',userController.logout);
router.get('/change-pasword',userController.changePasswordPage);
router.post('/change-password',userController.changePassword)
router.post('/recover',userController.sendRecoverMail);
router.get('/recover/:id',userController.recoverPasswordPage);
router.post('/recover/:id',userController.recover);
router.get('/history-order',ensureLoggedIn('/login'),userController.historyOrderPage);
router.get('/history-order/detail/:id',ensureLoggedIn('/login'),userController.historyOrderDetail);
module.exports = router;
