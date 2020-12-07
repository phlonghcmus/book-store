const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

exports.get=async()=>{
    const userCollection= db().collection('user');

    const user= await userCollection.findOne({_id:ObjectId("5fcdac391cd7911bf4fc4687")});
    return user;
}

exports.update=async(data)=>
{
    const userCollection= db().collection('user');

    const user= await userCollection.updateOne({ _id: ObjectId("5fcdac391cd7911bf4fc4687") }, {$set: data}, function (err, results) {});
    return user;
}