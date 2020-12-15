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
    const replacements={
      pagination:{
          page: req.query.page,
          pageCount: 5
      }
    }
    const htmlToSend = template(replacements);
   res.json(htmlToSend);
}