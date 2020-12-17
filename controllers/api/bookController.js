const bookModel = require('../../models/bookModel');
const toQS = require('querystring').stringify;
const category=require('../../models/categoryModel');
const fs = require('fs');
const { handlebars } = require('hbs')
const commentModel=require('../../models/commentModel');
exports.list=async(req,res,next)=>
{
   const books=await bookModel.listPerPage(req.query.page);
   res.json(books);
}

exports.pagination=async(req,res,next)=>
{
    const htmlfile = await fs.readFileSync(__dirname + "/../../utils/render-template/pagination.html", { encoding: "utf-8" });
    const template=handlebars.compile(htmlfile);
    const total=await bookModel.pageCountList();
    const replacements={
      pagination:{
          page: req.query.page,
          pageCount: Math.ceil(req.query.count)
      }
    }
    const htmlToSend = template(replacements);
   res.json(htmlToSend);
}

exports.categoryList=async(req,res,next)=>
{
  const books=await bookModel.categoryPerPage(req.query.categoryID,req.query.page);
   res.json(books);
}

exports.pageCount=async(req,res,next)=>
{
  const pageCount=await bookModel.pageCountList();
  res.json(pageCount);
}

exports.categoryPageCount=async(req,res,next)=>
{
  const pageCount=await bookModel.pageCountCategory(req.query.categoryID);
  res.json(pageCount);
}

exports.searchList=async(req,res,next)=>
{
  let books;
  if(req.query.categoryID)
  {
    books=await bookModel.categorySearchPerPage(req.query.categoryID,req.query.keyword,req.query.page);
  }
  else
  {
    books=await bookModel.searchPerPage(req.query.keyword,req.query.page);
  }
  res.json(books);
}

exports.searchListCount=async(req,res,next)=>
{
  let pageCount;
  let id;
  const keyword=req.query.keyword;
  const page=req.query.page;
  if(req.query.categoryID)
  {
    id=req.query.categoryID;
    pageCount= await bookModel.pageCountCategorySearch(id,keyword,page);
  }
  else
  {
    pageCount=await bookModel.pageCountSearch(keyword);
  }
  res.json(pageCount);
}

exports.updateComment=async(req,res,next)=>
{
  let comments;
  let bookID=req.query.bookId;
  let userComment=req.query.comment;
  let page;

  if(req.query.name)
  {
    let username=req.query.name;
    await commentModel.addCommentWithoutUser(bookID,username,userComment);
    page=await commentModel.countCommentsByBookID(bookID);
    comments=await commentModel.getCommentsByBookID(bookID,Math.ceil(page));
  }
  else
  {
    await commentModel.addCommentWithUser(bookID,req.user._id,userComment);
    page=await commentModel.countCommentsByBookID(bookID);
    comments=await commentModel.getCommentsByBookID(bookID,Math.ceil(page));
  }
  page=await commentModel.countCommentsByBookID(bookID);
  res.json({comments:comments,page:Math.ceil(page)});
}

exports.paginationComment=async(req,res,next)=>
{
    const htmlfile = await fs.readFileSync(__dirname + "/../../utils/render-template/comment-pagination.html", { encoding: "utf-8" });
    const template=handlebars.compile(htmlfile);
    const total=await commentModel.countCommentsByBookID(req.query.bookId);
    const replacements={
      pagination:{
          page: req.query.page,
          pageCount: total
      },
      user:req.user
    }
    const htmlToSend = template(replacements);
   res.json(htmlToSend);
}

exports.commentList=async(req,res,next)=>
{
  let bookID=req.query.bookId;
  let page=req.query.page;
  const comments=await commentModel.getCommentsByBookID(bookID,Math.ceil(page));
  res.json(comments);
}

// exports.commentCount=async(req,res,next)=>
// {
//   const bookID=req.query.bookId;
//   res.json(await commentModel.countCommentsByBookID(bookID));
// }