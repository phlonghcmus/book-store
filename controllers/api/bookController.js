const bookModel = require('../../models/bookModel');
const toQS = require('querystring').stringify;
const category=require('../../models/categoryModel');
const fs = require('fs');
const { handlebars } = require('hbs')
exports.list=async(req,res,next)=>
{
   const books=await bookModel.listPerPage(req.query.page);
   res.json(books);
}

exports.pagination=async(req,res,next)=>
{
    const htmlfile = await fs.readFileSync(__dirname + "/../../utils/pagination.html", { encoding: "utf-8" });
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