const cartModel = require('../../models/cartModel');
const toQS = require('querystring').stringify;
const fs = require('fs');
const { handlebars } = require('hbs')
const ObjectId= require('mongodb').ObjectId;

exports.addCart=async(req,res,next)=>
{
    const bookID=req.query.bookID;
    const cartID=req.query.cartID;
    const update=await cartModel.updateCarts(cartID,bookID);
    const newCart=await cartModel.getCart(cartID);
    
    res.json(newCart);
}