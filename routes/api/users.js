const express = require('express');
const router = express.Router();

const userController = require('../../controllers/api/userController');

router.get("/username-is-exist", userController.usernameIsExist);
router.get("/email-is-exist", userController.emailIsExist);
module.exports = router;