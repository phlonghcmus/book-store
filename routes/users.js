const express = require('express');
const router = express.Router();
const userController=require('../controllers/userController');
const multer  = require('multer');


const upload = multer({ dest: 'public/uploads/' ,fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }})
/* GET users listing. */
router.get('/profile',userController.profile);
router.post('/profile/update',upload.single('file-avatar'),userController.profileUpdate);

module.exports = router;
