const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/* GET list of books. */
router.get('/', bookController.list);
router.get('/detail/:id',bookController.detail);
router.get('/search',bookController.searchList);
router.get('/category/:id',bookController.category);
router.get('/category/:id/search',bookController.categorySearch);
module.exports = router;