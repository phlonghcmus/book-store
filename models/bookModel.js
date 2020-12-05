const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

//Lấy danh sách các quyển sách trong 1 trang

exports.listPerPage = async (currentPage) => {
   const bookCollection= db().collection('books');
    bookCollection.createIndex({"remove":1,"categoryID":1,"title":1});

    const books=await bookCollection.find({"remove":false}).limit(6).skip((currentPage-1)*6).toArray();
    return books;
};
exports.get=async(id)=>{
    const bookCollection= db().collection('books');

    const books= await bookCollection.findOne({_id:ObjectId(id)});
    return books;
}


//Lấy danh sách các quyển sách trong 1 trang thỏa điều kiện tìm kiếm
exports.searchPerPage=async(str,page)=>
{
     const bookCollection= db().collection('books');
    let  books=await bookCollection.find(
        {$and:[
            {"remove": false},
            {"title": {"$regex": str, "$options": "i"}}
            
        ]}).limit(6).skip((page-1)*6).toArray();

    if(books.length===0)
         books=await bookCollection.find(
             {$and:[
                {"remove": false},
                {"non-accent title": {"$regex": str, "$options": "i"}}
                     
             ]}).limit(6).skip((page-1)*6).toArray();
    return books;
}

// Đếm số cuốn sách trong 1 trang
exports.pageCountList= async()=>
{
     const bookCollection= db().collection('books');
    const count=await bookCollection.find({"remove":false}).count();
    return count/6;
}


// Đếm số cuốn sách thỏa điều kiện tìm kiếm
exports.pageCountSearch=async(str)=>
{
     const bookCollection= db().collection('books');
    let count=await bookCollection.find({
        $and:[
                {"remove": false},
                {"title": {"$regex": str, "$options": "i"}}
            
        ]}).count();

    if(count===0)
        count=await bookCollection.find({
            $and:[
                    {"remove": false},
                    {"non-accent title": {"$regex": str, "$options": "i"}}
                
            ]}).count();
    return count/6;
}

// Đếm số cuốn trách thỏa điều kiện filter
exports.pageCountCategory=async(id)=>{
     const bookCollection= db().collection('books');
    let count=await bookCollection.find({
        $and:[
            {"remove": false},
            {"categoryID": ObjectId(id)}
            
        ]}).count();
    return count/6;
}

//Lấy danh sách các quyển sách cho một trang thỏa filter
exports.categoryPerPage=async(id,page)=>
{
     const bookCollection= db().collection('books');
    let  books=await bookCollection.find(
        {$and:[
                {"remove": false},
                {"categoryID": ObjectId(id)}
                
            ]}).limit(6).skip((page-1)*6).toArray();

    return books;
}

//Đếm danh sách các quyển sách tìm kiếm được thỏa điều kiện filter
exports.pageCountCategorySearch=async(id,str,page)=>
{
    const bookCollection= db().collection('books');
    let count=await bookCollection.find({
        $and:[
            {"remove": false},
             {"categoryID": ObjectId(id)},
            {"title": {"$regex": str, "$options": "i"}}
           
            
        ]}).count();

    if(count===0)
        count=await bookCollection.find(
            {$and:[
                    {"remove": false},
                    {"categoryID": ObjectId(id)},
                    {"non-accent title": {"$regex": str, "$options": "i"}}
            ]}).count();
    return count/6;
}

// Lấy danh sách các quyển sách tìm kiếm được thỏa điều kiện filter
exports.categorySearchPerPage=async(id,str,page)=>
{
     const bookCollection= db().collection('books');
    let books=await bookCollection.find({
        $and:[
            {"remove": false},
            {"categoryID": ObjectId(id)},
            {"title": {"$regex": str, "$options": "i"}}
            
        ]}).limit(6).skip((page-1)*6).toArray();

    if(books.length===0)
        books=await bookCollection.find(
            {$and:[
                    {"remove": false},
                    {"categoryID": ObjectId(id)},
                    {"non-accent title": {"$regex": str, "$options": "i"}}
                    
                ]}).limit(6).skip((page-1)*6).toArray();
    return books;
}

