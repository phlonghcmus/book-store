const bookModel = require('../models/bookModel');

exports.list = (req, res, next) => {
    // Get books from model
    const books = bookModel.list();
    // Pass data to view to display list of books
    res.render('books/list', {books});
};

exports.detail=(req, res, next) =>
{
    const books = bookModel.list();
    const tt= bookModel.get(parseInt(req.params.id));
    const title=tt.title;
    const basePrice=tt.basePrice;
    const detail=tt.detail;
    const cover=tt.cover;
    res.render('books/detail',{title,basePrice,detail,cover,books});
};
