const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

exports.categoryList=async ()=>
{
    const categoriesCollection=db().collection('categories');
    const categories=await categoriesCollection.find().toArray();
    return categories;
}

