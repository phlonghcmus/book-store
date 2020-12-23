const bookModel = require('../../models/bookModel');
const toQS = require('querystring').stringify;
const category = require('../../models/categoryModel');
const fs = require('fs');
const { handlebars } = require('hbs')
const commentModel = require('../../models/commentModel');
const ObjectId = require('mongodb').ObjectId;
exports.list = async (req, res, next) => 
{
  let books;
  if (req.query.sort)
    books=await bookModel.listPerPageSort(req.query.page,req.query.sort);
  else
    books = await bookModel.listPerPage(req.query.page);
  res.json(books);
}

exports.pagination = async (req, res, next) => {
  const htmlfile = await fs.readFileSync(__dirname + "/../../utils/render-template/pagination.html", { encoding: "utf-8" });
  const template = handlebars.compile(htmlfile);
  const total = await bookModel.pageCountList();
  const replacements = {
    pagination: {
      page: req.query.page,
      pageCount: Math.ceil(req.query.count),

    },
    cart: res.locals.cart
  }
  const htmlToSend = template(replacements);
  res.json(htmlToSend);
}

exports.categoryList = async (req, res, next) => {
  let books;
  console.log(req.query.sort);
  if (req.query.sort)
    books=await bookModel.categoryPerPageSort(req.query.categoryID, req.query.page,req.query.sort);
  else
    books = await bookModel.categoryPerPage(req.query.categoryID, req.query.page);
  res.json(books);
}

exports.pageCount = async (req, res, next) => {
  const pageCount = await bookModel.pageCountList();
  res.json(pageCount);
}

exports.categoryPageCount = async (req, res, next) => {
  const pageCount = await bookModel.pageCountCategory(req.query.categoryID);
  res.json(pageCount);
}

exports.searchList = async (req, res, next) => {
  let books;
  if (req.query.categoryID) {
    if(req.query.sort)
      books = await bookModel.categorySearchPerPageSort(req.query.categoryID, req.query.keyword, req.query.page,req.query.sort);
    else
      books = await bookModel.categorySearchPerPage(req.query.categoryID, req.query.keyword, req.query.page);
  }
  else {
    if(req.query.sort)
      books=await bookModel.searchPerPageSort(req.query.keyword, req.query.page,req.query.sort);
    else
      books = await bookModel.searchPerPage(req.query.keyword, req.query.page);
  }
  res.json(books);
}

exports.searchListCount = async (req, res, next) => {
  let pageCount;
  let id;
  const keyword = req.query.keyword;
  const page = req.query.page;
  if (req.query.categoryID) {
    id = req.query.categoryID;
    pageCount = await bookModel.pageCountCategorySearch(id, keyword, page);
  }
  else {
    pageCount = await bookModel.pageCountSearch(keyword);
  }
  res.json(pageCount);
}

exports.updateComment = async (req, res, next) => {
  let comments;
  let bookID = req.query.bookId;
  let userComment = req.query.comment;
  let page;
  let mydata;
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let hh = today.getHours();
  let mmmm = today.getMinutes();

  today = dd + '/' + mm + '/' + yyyy + ' - ' + hh + ':' + mmmm;
  if (req.query.name) {
    let username = req.query.name;
    const cover = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
    mydata = {
      book_id: ObjectId(bookID),
      username: req.query.name,
      comment: userComment,
      date: today,
      cover: cover
    }
    await commentModel.addCommentWithoutUser(mydata);
    page = await commentModel.countCommentsByBookID(bookID);
    comments = await commentModel.getCommentsByBookID(bookID, Math.ceil(page));
  }
  else {
    mydata = {
      book_id: ObjectId(bookID),
      user_id: req.user._id,
      comment: userComment,
      date: today
    }
    await commentModel.addCommentWithUser(mydata);
    page = await commentModel.countCommentsByBookID(bookID);
    comments = await commentModel.getCommentsByBookID(bookID, Math.ceil(page));
  }
  page = await commentModel.countCommentsByBookID(bookID);
  res.json({ comments: comments, page: Math.ceil(page) });
}

exports.paginationComment = async (req, res, next) => {
  const htmlfile = await fs.readFileSync(__dirname + "/../../utils/render-template/comment-pagination.html", { encoding: "utf-8" });
  const template = handlebars.compile(htmlfile);
  const total = await commentModel.countCommentsByBookID(req.query.bookId);
  const replacements = {
    pagination: {
      page: req.query.page,
      pageCount: Math.ceil(total)
    },
    user: req.user,
    pageCount: Math.ceil(total)
  }
  const htmlToSend = template(replacements);
  res.json(htmlToSend);
}

exports.commentList = async (req, res, next) => {
  let bookID = req.query.bookId;
  let page = req.query.page;
  const comments = await commentModel.getCommentsByBookID(bookID, Math.ceil(page));
  res.json(comments);
}

// exports.commentCount=async(req,res,next)=>
// {
//   const bookID=req.query.bookId;
//   res.json(await commentModel.countCommentsByBookID(bookID));
// }