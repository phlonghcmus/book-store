const cartModel = require('../../models/cartModel');
const toQS = require('querystring').stringify;
const fs = require('fs');
const { handlebars } = require('hbs')
const ObjectId= require('mongodb').ObjectId;
const orderModel=require('../../models/orderModel');
exports.addProduct=async(req,res,next)=>
{
    const bookID=req.query.bookID;
    const cartID=req.query.cartID;
    const add=await cartModel.addProduct(cartID,bookID);
    if(add==false)
        res.json(add);
    else{   
    const newCart=await cartModel.getCart(cartID);
    res.json(newCart);
    }
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

exports.order=async(req,res,next)=>
{
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hh=today.getHours();
    let mmmm=today.getMinutes();
  
  today = dd + '/' + mm + '/' + yyyy + ' - ' + hh+ ':' + mmmm; 

    const data={
        mail: req.user.email,
        place: req.query.location,
        total: res.locals.cart.total_price,
        order_date:today,
        user_id: ObjectId(req.user._id),
        status:1,
        books:res.locals.cart.books,
        total_quantity:res.locals.cart.total_quantity
    }
    await orderModel.insertOrder(data);
    await cartModel.removeCart(res.locals.cart._id);
    res.json(true);
}