const { db } = require('../database/database');
const ObjectId = require('mongodb').ObjectId;

exports.updateQuantity = async (cart_id, bookId) => {
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
    let newValue = parseInt(oldValue) + 1;
    console.log(newValue);
    let data=
    {
        book_id:ObjectId(bookId),
        quantity:parseInt(newValue),
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
        {$set:{'books.$.quantity':newValue}}
    )
    // const bookID = await cartsCollection.aggregate
    //     (
    //         [
    //             { $match: { _id: ObjectId(cart_id) } },
    //             { "$project": { index: { $indexOfArray: ["$books.book_id",ObjectId(book_id)] } } }

    //         ]
    //     ).toArray();

    // console.log(bookID);
    // const index = bookID[0].index;
    // const element = await { "$project": { "matched": { "$arrayElemAt": ["$quantity", index] } } };
    // let value = await cartsCollection.aggregate([element]).toArray();
    // console.log(index);
    // value = value[0].matched;
    // let update4 = { "$set": {} };
    // update4["$set"]["quantity." + index] = parseInt(value) + 1;
    // await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, update4);
    // await cartsCollection.updateOne(
    //     {_id:ObjectId(cart_id),
    //     books:{$elemMatch:{book_id:ObjectId(books_id)}
    // }
    // },
    // {$set:{'books.$.quantity':1}}
    // )
}

exports.updatePrice = async (cart_id, bookId) => {
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
    cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
}
exports.updateCarts = async (cart_id, bookId) => {
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
        await this.updateQuantity(cart_id, bookId);
    }
    else {
        const value=parseInt("1");
        const data=
        {
            book_id:ObjectId(bookId),
            quantity:value
        };
        await cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { $push: { books:data } });
    }
    await this.updatePrice(cart_id, bookId);
    await this.updateTotalQuantity(cart_id);
}

exports.createCarts = async () => {
    const cartsCollection = db().collection('carts');
    const data = {
        "total_price": 0,
        "book_id": [],
        "quantity": []

    }
    const cart = await cartsCollection.insertOne(data);
    return cart.ops[0];
}

exports.updateTotalQuantity=async(cart_id)=>
{
    const cartsCollection = db().collection('carts');
    const carts = await cartsCollection.findOne({ _id: ObjectId(cart_id) });
    const oldQuantity=carts.total_quantity;
    console.log(oldQuantity);
    const data =
    {
        total_quantity: parseInt(oldQuantity) + 1
    };
    cartsCollection.updateOne({ _id: ObjectId(cart_id) }, { "$set": data });
    
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