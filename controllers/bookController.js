const bookModel = require('../models/bookModel');

exports.list = async(req, res, next) => {
    const currentPage=req.query.p || 1;
    console.log(currentPage);
    // Get books from model
    let books = await bookModel.list();
    let pageCount=books.length/6;
    const intPageCount=pageCount;
    if(pageCount>parseInt(String(intPageCount)))
        Math.ceil(pageCount);
    console.log(Math.ceil(pageCount));
    books=await bookModel.listPerPage(currentPage);
    // Pass data to view to display list of books
    res.render('books/list', {books,pagination:{page:currentPage,pageCount:Math.ceil(pageCount)}});
};

exports.detail=async (req, res, next) =>
{
    const books = await bookModel.list();
    const tt= await bookModel.get(req.params.id);
    const title=tt.title;
    const basePrice=tt.basePrice;
    const detail=tt.detail;
    const cover=tt.cover;
    res.render('books/detail',{title,basePrice,detail,cover,books});
};
