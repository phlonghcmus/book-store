const bookModel = require('../models/bookModel');
const toQS = require('querystring').stringify;
const category=require('../models/categoryModel');
const commentModel=require('../models/commentModel');
exports.list = async(req, res, next) => {

   
    let currentPage=req.query.p || 1;
    let books;
    let pageCount;

    // Get books from model
    pageCount = await bookModel.pageCountList();
    console.log(pageCount);
    books=await bookModel.listPerPage(currentPage);

    if(currentPage>Math.ceil(pageCount))
    {
        req.query.p= 5 ||1;
    }

    const count=books.length;
    const categories=await category.categoryList();
    // Pass data to view to display list of books
        res.render('books/list', {books,count,categories,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
};

exports.searchList=async (req,res,next)=>
{

    let currentPage=req.query.p || 1;
    let keyword=req.query.keyword;
    let books;
    let pageCount;
    let newQuery;
    pageCount= await bookModel.pageCountSearch(keyword);
    books=await bookModel.searchPerPage(keyword,currentPage);
    const query=req.query;
    newQuery=toQS(query);
    if(req.query.p)
    {
        newQuery=newQuery.split('&').shift();
    }
    newQuery+="&";
    if(currentPage>Math.ceil(pageCount))
    {
        req.query.p= 5 ||1;
    }
    const count=books.length;
    // Pass data to view to display list of books
    const categories=await category.categoryList();
    if(count===0)
        res.render('books/noList',{count,categories});
    else
        res.render('books/list', {books,count,categories,query:newQuery,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
}



exports.detail=async (req, res, next) =>
{
   
    const tt= await bookModel.get(req.params.id);
    const title=tt.title;
    const basePrice=tt.basePrice;
    const detail=tt.detail;
    const cover=tt.cover;
    let currentPage=req.query.p || 1;
    const _id=tt._id;

    // pageCount = await bookModel.pageCountList();
    // console.log(pageCount);
    // books=await bookModel.listPerPage(currentPage);

    const pageCount=await commentModel.countCommentsByBookID(req.params.id);
    console.log(pageCount);
    const comments=await commentModel.getCommentsByBookID(req.params.id);
    if(pageCount>0)
    res.render('books/detail',{_id,title,basePrice,detail,cover,pageCount:Math.ceil(pageCount),comments,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
    else
    res.render('books/detail',{_id,title,basePrice,detail,cover,comments});
};

exports.category=async (req,res,next)=>
{
    let currentPage=req.query.p || 1;
    let id=req.params.id;
    let books;
    let pageCount;
    pageCount= await bookModel.pageCountCategory(id);
    books=await bookModel.categoryPerPage(id,currentPage);
    const count=books.length;
    // Pass data to view to display list of books
    const categories=await category.categoryList();
    res.render('books/list', {books,count,categories,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
}

exports.categorySearch=async(req,res,next)=>
{
    let currentPage=req.query.p || 1;
    let id=req.params.id;
    let keyword=req.query.keyword;
    let books;
    let pageCount;
    let newQuery;
    pageCount= await bookModel.pageCountCategorySearch(id,keyword,currentPage);
    books=await bookModel.categorySearchPerPage(id,keyword,currentPage);
    const query=req.query;
    newQuery=toQS(query);
    if(req.query.p)
    {
        newQuery=newQuery.split('&').shift();
    }
    newQuery+="&";
    if(currentPage>Math.ceil(pageCount))
    {
        req.query.p= 5 ||1;
    }
    const count=books.length;
    // Pass data to view to display list of books
    const categories=await category.categoryList();

    if(count===0)
        res.render('books/noList',{count,categories});
    else
        res.render('books/list', {books,count,categories,query:newQuery,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
}
