const cartModel = require('../../models/cartModel');

module.exports= async(req, res, next) => {
    if (res.locals.cart) { }
    else {
        if (req.cookies.cart) {
            const cart = await cartModel.getCart(req.cookies.cart);
            res.locals.cart = cart;
        }
        else {
            const cart = await cartModel.getCart("5fdd6f78c222626a153c7dea");
            res.cookie('cart', cart._id, { maxAge: 900000, httpOnly: true });
            res.locals.cart = cart;
            console.log('cookie created successfully');

        }
    }

   next();
};

