const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/api/bookController');


router.get('/list',bookController.list);
router.get('/pagination',bookController.pagination);
module.exports = router;