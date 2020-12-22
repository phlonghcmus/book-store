const cartModel = require('../../models/cartModel');

module.exports= async(req, res, next) => {
    if (res.locals.cart) { }
    else {
        if (req.cookies.cart) {
            let cart = await cartModel.getCart(req.cookies.cart);
            if(cart)
            {
                res.locals.cart=cart;
            }
            else
            {
                cart=await cartModel.createCarts();
                res.clearCookie('cart');
                console.log('clear old cookie created successfully');
                res.cookie('cart', cart._id, { maxAge: 900000, httpOnly: true });
                res.locals.cart = cart;
                console.log('cookie created successfully');
            }
        }
        else {
            const cart = await cartModel.createCarts();
            res.cookie('cart', cart._id, { maxAge: 900000, httpOnly: true });
            res.locals.cart = cart;
            console.log('cookie created successfully');

        }
    }

    if(req.user)
    {
        const user=req.user;
        const userCart=await cartModel.getUserCart(user._id);
        if(userCart)
        {
            const isCheckOutLocal=await cartModel.isCartCheckOut(res.locals.cart._id);
            const isCheckOutUser=await cartModel.isCartCheckOut(userCart._id);
            console.log(isCheckOutLocal);
            console.log(isCheckOutUser);
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
            res.clearCookie('cart');
        }
    }

   next();
};

