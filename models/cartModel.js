const { db } = require('../database/database');
const ObjectId = require('mongodb').ObjectId;
const bookModel=require('./bookModel');




exports.addQuantity = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    
  
    const book = await cartsCollection.aggregate([
        // Get just the docs that contain a shapes element where color is 'red'
        { $match: { '_id': ObjectId(cart_id) } },
        { $unwind: "$books" },
        {
            $match: {
                "books.book_id": ObjectId(bookId)
            }
        }
    ]).toArray();


    

    let oldValue = book[0].books.quantity;
    let newValue = parseInt(oldValue) + 1;
    console.log(newValue);
   
    let data =
    {
        book_id: ObjectId(bookId),
        quantity: parseInt(newValue),
    }
    console.log(data);
    await cartsCollection.updateOne(
        {
            $and:
                [
                    { _id: ObjectId(cart_id) },
                    { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                ]
        },
        { $set: { 'books.$.quantity': newValue } }
    )
    return true;
}

exports.addTotalPrice = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const booksCollection = db().collection('books');
    const books = await booksCollection.findOne({ _id: ObjectId(bookId) });
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const price = books.basePrice;
    const oldPrice = carts.total_price;
    const data =
    {
        total_price: parseInt(price) + parseInt(oldPrice)
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
}
exports.addProduct = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const stockCheck=await bookModel.stockCheck(bookId);
    if(stockCheck==0)
        return false;
    
    const newStock=parseInt(stockCheck)-1;
    await bookModel.updateBookStock(bookId,newStock);
    const soldBook=await bookModel.getSoldById(bookId);
    const newSold=parseInt(soldBook)+1;
    await bookModel.updateSoldById(bookId,newSold);
    const check = await cartsCollection.find(
        {
            $and:
                [
                    { _id: ObjectId(cart_id) },
                    { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                ]
        }).count();
    if (check >= 1) {
        await this.addQuantity(cart_id, bookId);
        
    }
    else {
        const value = parseInt("1");
        const data =
        {
            book_id: ObjectId(bookId),
            quantity: value
        };
        await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { $push: { books: data } });
    }
    await this.addTotalQuantity(cart_id,bookId);
    await this.addTotalPrice(cart_id, bookId);
    return true;
}

exports.createCarts = async () => {
    const cartsCollection = db().collection('carts');
    const data = {
        "total_price": 0,
        "books": [],
        "total_quantity": 0,
        "checkout": false,
        "createdAt": new Date(),

    }
    const cart = await cartsCollection.insertOne(data);
    await cartsCollection.createIndex({ "createAt": 1 }, { expireAfterSeconds: 172800 });
    return cart.ops[0];
}

exports.addUserToCart = async (cart_id, userId) => {
    const cartsCollection = db().collection('carts');
    const data =
    {
        user_id: ObjectId(userId)
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$unset": { 'createdAt': "" } }, false, true);
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { $set: data });
}

exports.getUserCart = async (userId) => {
    const cartsCollection = db().collection('carts');
    const cart = await cartsCollection.aggregate(
        [
            { $match: { user_id: ObjectId(userId) } },

            {
                $lookup: {
                    "from": "books",
                    "localField": 'books.book_id',
                    "foreignField": '_id',
                    "as": 'book'
                }
            },
            {
                $addFields: {
                    books_detail:
                    {
                        $map: {
                            input: "$books",
                            as: "e",
                            in: {
                                $mergeObjects: [
                                    "$$e",
                                    { $arrayElemAt: [{ $filter: { input: "$book", as: "j", cond: { $eq: ["$$e.book_id", "$$j._id"] } } }, 0] }
                                ]
                            }
                        }
                    }
                }
            },

            { $project: { book: 0 } }

        ]
    ).toArray();
    return cart[0];
}


exports.checkUserCart = async (user_id) => {
    const cartsCollection = db().collection('carts');
    const check = await cartsCollection.find(

        { user_id: ObjectId(user_id) },

    ).count();
    if (check >= 1)
        return true;
    else
        return false;
}

exports.isCartCheckOut = async (cart_id) => {
    const cartsCollection = db().collection('carts');
    const check = await cartsCollection.find(
        {
            $and: [
                { _id: ObjectId(cart_id) },
                { checkout: true }
            ]
        }).count();
    if (check >= 1)
        return true;
    else
        return false;
}

exports.checkOutCart = async (cart_id) => {
    const cartsCollection = db().collection('carts');
    const data =
    {
        checkout: true,
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { $set: data });
}

exports.addTotalQuantity = async (cart_id,bookId) => {
    const cartsCollection = db().collection('carts');
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });

    
    const oldQuantity = carts.total_quantity;
    console.log(oldQuantity);
    const data =
    {
        total_quantity: parseInt(oldQuantity) + 1
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
    return true;
}
exports.getCart = async (cart_id) => {
    const cartsCollection = db().collection('carts');
    const cart = await cartsCollection.aggregate(
        [
            { $match: { _id: ObjectId(cart_id) } },

            {
                $lookup: {
                    "from": "books",
                    "localField": 'books.book_id',
                    "foreignField": '_id',
                    "as": 'book'
                }
            },
            {
                $addFields: {
                    books_detail:
                    {
                        $map: {
                            input: "$books",
                            as: "e",
                            in: {
                                $mergeObjects: [
                                    "$$e",
                                    { $arrayElemAt: [{ $filter: { input: "$book", as: "j", cond: { $eq: ["$$e.book_id", "$$j._id"] } } }, 0] }
                                ]
                            }
                        }
                    }
                }
            },

            { $project: { book: 0 } }

        ]
    ).toArray();

    return cart[0];
}

exports.decreaseProduct = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const stock=await bookModel.stockCheck(bookId);
    const newStock=parseInt(stock)+1;
    await bookModel.updateBookStock(bookId,newStock);
    const soldBook=await bookModel.getSoldById(bookId);
    const newSold=parseInt(soldBook)-1;
    if(newSold<=0)
        newSold=0;
    await bookModel.updateSoldById(bookId,newSold);
    const check = await cartsCollection.find(
        {
            $and:
                [
                    { _id: ObjectId(cart_id) },
                    { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                ]
        }).count();
    if (check >= 1) {
        await this.decreaseQuantity(cart_id, bookId);
        await this.decreaseTotalPrice(cart_id, bookId);
        await this.decreaseTotalQuantity(cart_id);
    }
    else {
        return;
    }

}

exports.decreaseQuantity = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    console.log(bookId);

    const book = await cartsCollection.aggregate([
        // Get just the docs that contain a shapes element where color is 'red'
        { $match: { '_id': ObjectId(cart_id) } },
        { $unwind: "$books" },
        {
            $match: {
                "books.book_id": ObjectId(bookId)
            }
        }
    ]).toArray();
    console.log(book[0]);
    let oldValue = book[0].books.quantity;
    let newValue = parseInt(oldValue) - 1;
    console.log(newValue);
    if (newValue <= 0) {
        await cartsCollection.updateOne(
            {
                $and:
                    [
                        { _id: ObjectId(cart_id) },
                        { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                    ]
            },
            { $pull: { 'books': { book_id: ObjectId(bookId) } } }, { multi: true }
        )
    }
    else {
        let data =
        {
            book_id: ObjectId(bookId),
            quantity: parseInt(newValue),
        }
        console.log(data);
        await cartsCollection.updateOne(
            {
                $and:
                    [
                        { _id: ObjectId(cart_id) },
                        { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                    ]
            },
            { $set: { 'books.$.quantity': newValue } }
        )
    }
}

exports.decreaseTotalQuantity = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const oldQuantity = carts.total_quantity;
    console.log(oldQuantity);
    const data =
    {
        total_quantity: parseInt(oldQuantity) - 1
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
}

exports.decreaseTotalPrice = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const booksCollection = db().collection('books');
    const books = await booksCollection.findOne({ _id: ObjectId(bookId) });
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const price = books.basePrice;
    const oldPrice = carts.total_price;
    const data =
    {
        total_price: parseInt(oldPrice) - parseInt(price)
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
}

exports.removeProduct = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const check = await cartsCollection.find(
        {
            $and:
                [
                    { _id: ObjectId(cart_id) },
                    { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                ]
        }).count();
    if (check >= 1) {
        await this.removeTotalPrice(cart_id, bookId);
        await this.removeTotalQuantity(cart_id, bookId);
        await cartsCollection.updateOne(
            {
                $and:
                    [
                        { _id: ObjectId(cart_id) },
                        { books: { $elemMatch: { book_id: ObjectId(bookId) } } }

                    ]
            },
            { $pull: { 'books': { book_id: ObjectId(bookId) } } }, { multi: true }
        )
    }
    else {
        return;
    }
}

exports.removeTotalQuantity = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    console.log(bookId);

    const book = await cartsCollection.aggregate([
        // Get just the docs that contain a shapes element where color is 'red'
        { $match: { '_id': ObjectId(cart_id) } },
        { $unwind: "$books" },
        {
            $match: {
                "books.book_id": ObjectId(bookId)
            }
        }
    ]).toArray();
    console.log(book[0]);
    let bookQuantity = book[0].books.quantity;
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const totalQuantity = carts.total_quantity;
    const data =
    {
        total_quantity: parseInt(totalQuantity) - parseInt(bookQuantity)
    };
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
    const stock=await bookModel.stockCheck(bookId);
    const newStock=parseInt(stock)+ parseInt(bookQuantity);
    await bookModel.updateBookStock(bookId,newStock);
    const soldBook=await bookModel.getSoldById(bookId);
    let newSold=parseInt(soldBook)-parseInt(bookQuantity);
    if(newSold<=0)
        newSold=0;
    await bookModel.updateSoldById(bookId,newSold);
}

exports.removeTotalPrice = async (cart_id, bookId) => {
    const cartsCollection = db().collection('carts');
    const booksCollection = db().collection('books');
    console.log(bookId);

    let book = await cartsCollection.aggregate([
        // Get just the docs that contain a shapes element where color is 'red'
        { $match: { '_id': ObjectId(cart_id) } },
        { $unwind: "$books" },
        {
            $match: {
                "books.book_id": ObjectId(bookId)
            }
        }
    ]).toArray();
    console.log(book[0]);
    let bookQuantity = book[0].books.quantity;
    book = await booksCollection.findOne({ _id: ObjectId(bookId) });
    let bookPrice = book.basePrice;
    const totalBookPrice = parseInt(bookPrice) * parseInt(bookQuantity);
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const oldPrice = carts.total_price;
    const newTotal_price = parseInt(oldPrice) - parseInt(totalBookPrice);
    let data;
    if (newTotal_price <= 0)
        data =
        {
            total_price: 0
        };
    else {
        data =
        {
            total_price: newTotal_price
        };
    }
    await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
}

exports.removeCart=async(cart_id)=>
{
    const cartsCollection = db().collection('carts');
    await cartsCollection.deleteOne({_id:ObjectId(cart_id)});
}