const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

exports.insertOrder=async(data)=>
{
    const collection=db().collection('orders');
    const order = await collection.insertOne(data);
    return order.ops[0];
}