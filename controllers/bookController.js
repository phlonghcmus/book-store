const bookModel = require('../models/bookModel');
const toQS = require('querystring').stringify;


exports.list = async(req, res, next) => {
    let currentPage=req.query.p || 1;
    let keyword=req.query.keyword;
    let books;
    let pageCount;
    let newQuery;
    if(keyword)
    {
        console.log(keyword);
        pageCount= await bookModel.pageCountSearch(keyword);
        books=await bookModel.searchPerPage(keyword,currentPage);
        const query=req.query;
        newQuery=toQS(query);
        if(req.query.p)
        {
            newQuery=newQuery.split('&').shift();
        }
        newQuery+="&";
    }
    else {
        // Get books from model
        pageCount = await bookModel.pageCountList();
        console.log(pageCount);
        books=await bookModel.listPerPage(currentPage);const query=req.query;
    }
    if(currentPage>Math.ceil(pageCount))
    {
        req.query.p= 5 ||1;
    }
    const count=books.length;
    // Pass data to view to display list of books
    if(keyword)
        res.render('books/list', {books,count,query:newQuery,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
    else
        res.render('books/list', {books,count,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
};



exports.detail=async (req, res, next) =>
{
   
    const tt= await bookModel.get(req.params.id);
    const title=tt.title;
    const basePrice=tt.basePrice;
    const detail=tt.detail;
    const cover=tt.cover;
    res.render('books/detail',{title,basePrice,detail,cover});
};
