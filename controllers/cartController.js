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
    const user=req.user;
    const userCart=await cartModel.getUserCart(user._id);
    if(userCart)
    {
        const isCheckOutLocal=await cartModel.isCartCheckOut(res.locals.cart._id);
        const isCheckOutUser=await cartModel.isCartCheckOut(userCart._id);
        if(isCheckOutUser)
            res.locals.cart=userCart;
        else{
            if(!isCheckOutLocal)
            res.locals.cart=userCart;
        }
    }
    else
    {
        await cartModel.addUserToCart(res.locals.cart._id,user._id);
    }
   
    const cart=res.locals.cart;
    const fullname=user.lastName+ " "+user.firstName;
    
    res.render('cart/checkout',
                {cart,
                fullname:fullname,
                location: user.location,
                mobile:user.mobile});
}

exports.isCheckOut=async(req,res,next)=>
{
    await cartModel.checkOutCart(res.locals.cart._id);
    next();
}