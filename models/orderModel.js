const { db } = require('../database/database');
const ObjectId = require('mongodb').ObjectId;

exports.insertOrder = async (data) => {
    const collection = db().collection('orders');
    const order = await collection.insertOne(data);
    return order.ops[0];
}

exports.getByUserId = async (user_id) => {
    const collection = db().collection('orders');
    const orders = await collection.find({ user_id: ObjectId(user_id) }).sort({ _id: -1 }).toArray();
    console.log(orders);
    return orders;
}

exports.getOrderByStatus = async (user_id, status) => {
    const collection = db().collection('orders');
    let orders;
    if (status == 2 || status == 3) {
        orders = await collection.find
            (
                {
                    $or: [
                        {
                            $and: [
                                { user_id: ObjectId(user_id) },
                                { status: 2 }
                            ]
                        },

                        {
                            $and: [
                                { user_id: ObjectId(user_id) },
                                { status: 3 }
                            ]
                        }]
                }
            ).sort({ _id: -1 }).toArray();
    }
    else {
            orders = await collection.find
            (
                {
                    $and: [
                        { user_id: ObjectId(user_id) },
                        { status: status }
                    ]
                }
            ).sort({ _id: -1 }).toArray();
        }
    return orders;
}
exports.cancelOrder = async (order_id) => {
    const newStatus = parseInt(5);
    const collection = db().collection('orders');
    await collection.updateOne({ _id: ObjectId(order_id) }, { $set: { status: newStatus } });
}

exports.reOrder = async (order_id) => {
    const newStatus = parseInt(1);
    const collection = db().collection('orders');
    await collection.updateOne({ _id: ObjectId(order_id) }, { $set: { status: newStatus } });
}


exports.countUserOrderByStatus = async (user_id, status) => {
    const collection = db().collection('orders');
    const count = await collection.find
        (
            {
                $and: [
                    { user_id: ObjectId(user_id) },
                    { status: status }
                ]
            }
        ).count();
    return count;
}

exports.countUserOrder = async (user_id) => {
    const collection = db().collection('orders');
    const orders = await collection.find({ user_id: ObjectId(user_id) }).count();
    console.log(orders);
    return orders;
}

exports.getOrderDetailById = async (order_id) => {
    const collection = db().collection('orders');
    const order = await collection.aggregate([
        { $match: { _id: ObjectId(order_id) } },

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
    return order[0];
}