//const bookModel = require('../models/bookModel');


exports.index = async(req, res, next) => {
    res.render('index/body', {});
};

exports.contact = (req, res, next) => {
    // Get books from model
    //const books = bookModel.list();
    // Pass data to view to display list of books
    res.render('index/contact', {});
};

exports.about = (req, res, next) => {
    // Get books from model
    //const books = bookModel.list();
    // Pass data to view to display list of books
    res.render('index/about', {});
};


