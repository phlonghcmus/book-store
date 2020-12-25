const bookModel = require('../models/bookModel');
const toQS = require('querystring').stringify;
const category=require('../models/categoryModel');
const commentModel=require('../models/commentModel');
exports.list = async(req, res, next) => {

   
    let currentPage=req.query.p || 1;
    let books;
    let pageCount;
    let sortCon;
    if(req.query.sort)
    {
        if(req.query.sort==="Popularity")
            sortCon=1;
        if(req.query.sort==="High Price → Low Price")
            sortCon=2;
        if(req.query.sort==="Low Price → High Price")
            sortCon=3;
        if(req.query.sort==="Best-selling")
            sortCon=4;
        books=await bookModel.listPerPageSort(currentPage,sortCon);
    }
    else
        books=await bookModel.listPerPage(currentPage);
    // Get books from model
    pageCount = await bookModel.pageCountList();
    console.log(pageCount);
    

    if(currentPage>Math.ceil(pageCount))
    {
        req.query.p= Math.ceil(pageCount) ||1;
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
    let sortCon;
    
    pageCount= await bookModel.pageCountSearch(keyword);
    if(req.query.sort)
    {
        if(req.query.sort==="Popularity")
            sortCon=1;
        if(req.query.sort==="High Price → Low Price")
            sortCon=2;
        if(req.query.sort==="Low Price → High Price")
            sortCon=3;
        if(req.query.sort==="Best-selling")
            sortCon=4;
        books=await bookModel.searchPerPageSort(keyword,currentPage,sortCon);
    }
    else
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
    const stock=tt.stock;
    // pageCount = await bookModel.pageCountList();
    // console.log(pageCount);
    // books=await bookModel.listPerPage(currentPage);
    await bookModel.increasePopularity(_id);
    const pageCount=await commentModel.countCommentsByBookID(req.params.id);
    console.log(pageCount);
    const comments=await commentModel.getCommentsByBookID(req.params.id);
    if(pageCount>0)
    res.render('books/detail',{_id,title,basePrice,detail,cover,pageCount:Math.ceil(pageCount),stock,comments,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
    else
    res.render('books/detail',{_id,title,basePrice,detail,cover,comments,stock});
};

exports.category=async (req,res,next)=>
{
    let currentPage=req.query.p || 1;
    let id=req.params.id;
    let books;
    let pageCount;
    let sortCon;
    if(req.query.sort)
    {

        if(req.query.sort==="Popularity")
            sortCon=1;
        if(req.query.sort==="High Price → Low Price")
            sortCon=2;
        if(req.query.sort==="Low Price → High Price")
            sortCon=3;
        if(req.query.sort==="Best-selling")
            sortCon=4;
        books=await bookModel.categoryPerPageSort(id,currentPage,sortCon);
    }
    else
        books=await bookModel.categoryPerPage(id,currentPage);

    
    pageCount= await bookModel.pageCountCategory(id);
   
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
    let sortCon;
    if(req.query.sort)
    {
        if(req.query.sort==="Popularity")
            sortCon=1;
        if(req.query.sort==="High Price → Low Price")
            sortCon=2;
        if(req.query.sort==="Low Price → High Price")
            sortCon=3;
        if(req.query.sort==="Best-selling")
            sortCon=4;
        books=await bookModel.categorySearchPerPageSort(id,keyword,currentPage,sortCon);
    }
    else
        books=await bookModel.categorySearchPerPage(id,keyword,currentPage);
    pageCount= await bookModel.pageCountCategorySearch(id,keyword,currentPage);
    
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
