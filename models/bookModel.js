const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

//Lấy danh sách các quyển sách trong 1 trang
exports.stockCheck=async(bookId)=>
{
    const booksCollection=db().collection('books');
    const thisBook=await booksCollection.findOne({_id:ObjectId(bookId)});
    const stock=thisBook.stock;
    return stock;
}

exports.updateBookStock=async(bookId,newStock)=>
{
    const booksCollection=db().collection('books');
    await booksCollection.updateOne({_id:ObjectId(bookId)},{$set:{stock:newStock}});
}
exports.increasePopularity=async(book_id)=>
{
    const bookCollection= db().collection('books');
    const book=await bookCollection.findOne({_id:ObjectId(book_id)});
    const oldSeen=book.seen;
    const newSeen=parseInt(oldSeen)+1;
    await bookCollection.updateOne({_id:ObjectId(book_id)},{$set:{seen:newSeen}});
}

exports.getSoldById=async(book_id)=>
{
    const bookCollection= db().collection('books');
    const book=await bookCollection.findOne({_id:ObjectId(book_id)});
    return book.sold;
}

exports.updateSoldById=async(book_id,newSold)=>
{
    const bookCollection= db().collection('books');
    const book=await bookCollection.updateOne({_id:ObjectId(book_id)},{$set:{sold:newSold}});
}


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

exports.listPerPageSort=async(currentPage,sortCon)=>
{
    const bookCollection= db().collection('books');
    let books;
    if(sortCon==1)
    {
        books=await bookCollection.find({"remove":false}).sort({"seen":-1}).limit(6).skip((currentPage-1)*6).toArray();
    }
    if(sortCon==2)
    {
        books=await bookCollection.find({"remove":false}).sort({"basePrice":-1}).limit(6).skip((currentPage-1)*6).toArray();
    }
    if(sortCon==3)
    {
        books=await bookCollection.find({"remove":false}).sort({"basePrice":1}).limit(6).skip((currentPage-1)*6).toArray();
    }
    if(sortCon==4)
    {
        books=await bookCollection.find({"remove":false}).sort({"sold":-1}).limit(6).skip((currentPage-1)*6).toArray();
    }
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
                {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                     
             ]}).limit(6).skip((page-1)*6).toArray();
    return books;
}

exports.searchPerPageSort=async(str,page,sortCon)=>
{
    const bookCollection= db().collection('books');
    let books;
    if(sortCon==1)
    {
        books=await bookCollection.find(
            {$and:[
                {"remove": false},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({"seen":-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
             books=await bookCollection.find(
                 {$and:[
                    {"remove": false},
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                         
                 ]}).sort({"seen":-1}).limit(6).skip((page-1)*6).toArray();
    }

    if(sortCon==2)
    {
        books=await bookCollection.find(
            {$and:[
                {"remove": false},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({"basePrice":-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
             books=await bookCollection.find(
                 {$and:[
                    {"remove": false},
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                         
                 ]}).sort({"basePrice":-1}).limit(6).skip((page-1)*6).toArray();
    }

    if(sortCon==3)
    {
        books=await bookCollection.find(
            {$and:[
                {"remove": false},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({"basePrice":1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
             books=await bookCollection.find(
                 {$and:[
                    {"remove": false},
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                         
                 ]}).sort({"basePrice":1}).limit(6).skip((page-1)*6).toArray();
    }

    if(sortCon==4)
    {
        books=await bookCollection.find(
            {$and:[
                {"remove": false},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({"sold":-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
             books=await bookCollection.find(
                 {$and:[
                    {"remove": false},
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                         
                 ]}).sort({"sold":-1}).limit(6).skip((page-1)*6).toArray();
    }
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
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                
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
        {$and:[{"remove": false},{"categoryID": ObjectId(id)}]}).limit(6).skip((page-1)*6).toArray();

    return books;
}

exports.categoryPerPageSort=async(id,page,sortCon)=>
{
    const bookCollection= db().collection('books');
    let books;
    if(sortCon==1)
    {
        books=await bookCollection.find(
            {$and:[{"remove": false},{"categoryID": ObjectId(id)}]}).sort({seen:-1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==2)
    {
        books=await bookCollection.find(
            {$and:[{"remove": false},{"categoryID": ObjectId(id)}]}).sort({basePrice:-1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==3)
    {
        books=await bookCollection.find(
            {$and:[{"remove": false},{"categoryID": ObjectId(id)}]}).sort({basePrice:1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==4)
    {
        books=await bookCollection.find(
            {$and:[{"remove": false},{"categoryID": ObjectId(id)}]}).sort({sold:-1}).limit(6).skip((page-1)*6).toArray();
    }
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
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
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
                    {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                    
                ]}).limit(6).skip((page-1)*6).toArray();
    return books;
}

exports.categorySearchPerPageSort=async(id,str,page,sortCon)=>
{
    const bookCollection= db().collection('books');
    let books;
    if(sortCon==1)
    {
        books=await bookCollection.find({
            $and:[
                {"remove": false},
                {"categoryID": ObjectId(id)},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({seen:-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
            books=await bookCollection.find(
                {$and:[
                        {"remove": false},
                        {"categoryID": ObjectId(id)},
                        {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                        
                    ]}).sort({seen:-1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==2)
    {
        books=await bookCollection.find({
            $and:[
                {"remove": false},
                {"categoryID": ObjectId(id)},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({basePrice:-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
            books=await bookCollection.find(
                {$and:[
                        {"remove": false},
                        {"categoryID": ObjectId(id)},
                        {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                        
                    ]}).sort({basePrice:-1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==3)
    {
        books=await bookCollection.find({
            $and:[
                {"remove": false},
                {"categoryID": ObjectId(id)},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({basePrice:1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
            books=await bookCollection.find(
                {$and:[
                        {"remove": false},
                        {"categoryID": ObjectId(id)},
                        {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                        
                    ]}).sort({basePrice:1}).limit(6).skip((page-1)*6).toArray();
    }
    if(sortCon==4)
    {
        books=await bookCollection.find({
            $and:[
                {"remove": false},
                {"categoryID": ObjectId(id)},
                {"title": {"$regex": str, "$options": "i"}}
                
            ]}).sort({sold:-1}).limit(6).skip((page-1)*6).toArray();
    
        if(books.length===0)
            books=await bookCollection.find(
                {$and:[
                        {"remove": false},
                        {"categoryID": ObjectId(id)},
                        {"nonAccentTitle": {"$regex": str, "$options": "i"}}
                        
                    ]}).sort({sold:-1}).limit(6).skip((page-1)*6).toArray();
    }
    return books;
}

exports.getBestSelling=async()=>{
    const bookCollection= db().collection('books');
    const books= await bookCollection.find().sort({sold: -1}).limit(3).toArray();
    return books;
}

exports.getMostSeen=async()=>{
    const bookCollection= db().collection('books');
    const books= await bookCollection.find().sort({seen: -1}).limit(10).toArray();
    return books;
}

exports.getNewBooks=async()=>{
    const bookCollection= db().collection('books');
    const books= await bookCollection.find().sort({_id: -1}).limit(10).toArray();
    return books;
}

exports.getFeaturedBooks=async(id)=>{
    const bookCollection= db().collection('books');
    const book= await bookCollection.findOne({_id: ObjectId(id)});
    const books = await bookCollection.find({categoryID: ObjectId(book.categoryID)},).limit(10).toArray();
    const index = books.findIndex(obj => obj.title === book.title);
    if (index > -1) {
        books.splice(index, 1);
      }
    return books;
}