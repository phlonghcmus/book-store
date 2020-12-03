const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;



exports.listPerPage = async (currentPage) => {
    const bookCollection=db().collection('books');
    books=await bookCollection.find().limit(6).skip((currentPage-1)*6).toArray();
    return books;
};
exports.get=async(id)=>{
    const bookCollection=db().collection('books');
    const book= await bookCollection.findOne({_id:ObjectId(id)});
    return book;
}


exports.searchPerPage=async(str,page)=>
{
    const bookCollection=db().collection('books');
    const books=await bookCollection.find({"title": {"$regex": str, "$options": "i"}}).limit(6).skip((page-1)*6).toArray();
    return books;
}

exports.pageCountList= async()=>
{
    const bookCollection=db().collection('books');
    const count=await bookCollection.find().count();
    return count/6;
}

exports.pageCountSearch=async(str)=>
{
    const bookCollection=db().collection('books');
    const count=await bookCollection.find({"title": {"$regex": str, "$options": "i"}}).count();
    return count/6;
}

