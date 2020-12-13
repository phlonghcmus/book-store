const express = require('express');
const router = express.Router();

const userApiController = require('../../controllers/api/userController');

router.get("/username-is-exist", userApiController.usernameIsExist);
router.get("/email-is-exist", userApiController.emailIsExist);

router.get("/password-is-exist", userApiController.passwordIsExist);
module.exports = router;