const cartModel = require('../../models/cartModel');
const toQS = require('querystring').stringify;
const fs = require('fs');
const { handlebars } = require('hbs')
const ObjectId= require('mongodb').ObjectId;

exports.addProduct=async(req,res,next)=>
{
    const bookID=req.query.bookID;
    const cartID=req.query.cartID;
    const add=await cartModel.addProduct(cartID,bookID);
    const newCart=await cartModel.getCart(cartID);
    
    res.json(newCart);
}

exports.decreaseProduct=async(req,res,next)=>
{
    const bookID=req.query.bookID;
    const cartID=req.query.cartID;
    const decrease=await cartModel.decreaseProduct(cartID,bookID);
    const newCart=await cartModel.getCart(cartID);
    res.json(newCart);
}

exports.removeProduct=async(req,res,next)=>
{
    const bookID=req.query.bookID;
    const cartID=req.query.cartID;
    const remove=await cartModel.removeProduct(cartID,bookID);
    const newCart=await cartModel.getCart(cartID);
    res.json(newCart);
}