const cartModel = require('../models/cartModel');
const toQS = require('querystring').stringify;
const fs = require('fs');
const { handlebars } = require('hbs')
const ObjectId= require('mongodb').ObjectId;

exports.wishList=async(req,res,next)=>
{
    const cart=res.locals.cart;
   res.render('cart/wishlist',{cart});

}

exports.checkOutPage=async(req,res,next)=>
{
    const user=res.locals.user;
    const cart=res.locals.cart;
    const fullname= user.firstname+" "+user.lastname;
    res.render('cart/checkout',{cart,fullname:fullname,location:user.location,mobile:user.mobile});
}