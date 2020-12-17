const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/api/bookController');


router.get('/list',bookController.list);
router.get('/category-list',bookController.categoryList);
router.get('/pagination',bookController.pagination);
router.get('/page-count',bookController.pageCount);
router.get('/category-page-count',bookController.categoryPageCount);
router.get('/search-list',bookController.searchList);
router.get('/search-list-count',bookController.searchListCount);
router.get('/comment',bookController.updateComment);
router.get('/pagination-comment',bookController.paginationComment);
router.get('/comments-list',bookController.commentList);
// router.get('/comments-count',bookController.commentCount);
module.exports = router;