const bookModel = require('../models/bookModel');

exports.list = async(req, res, next) => {
    // Get books from model
    const books = await bookModel.list();
    // Pass data to view to display list of books
    res.render('books/list', {books});
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
