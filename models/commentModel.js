const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;

exports.getCommentsByBookID=async(bookID,currentPage)=>
{
    const collection=db().collection('comments');
    const comments= await collection.aggregate([
        {	$match: {book_id: ObjectId(bookID)}},
        {
            $lookup: {
            "from": "user",
            "localField": 'user_id',
            "foreignField": '_id',
            "as":'user'
            }
        },
    
        {
          $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$user", 0 ] }, "$$ROOT" ] } }
           },
       { $project: { user: 0 } },
       { $skip: (currentPage-1)*3 },
       { $limit: 3},
       
    ]).toArray();
    return comments;
}

exports.countCommentsByBookID=async(bookID)=>
{
    const collection= db().collection('comments');
    const count =await collection.find({book_id:ObjectId(bookID)}).count();
    return count/3;
}
exports.addCommentWithUser=async(booksID,userID,userComment)=>
{
    const collection=db().collection('comments');
    const add=await collection.insertOne({book_id:ObjectId(booksID),user_id:userID,comment:userComment});
    return add;
}

exports.addCommentWithoutUser=async(booksID,username,userComment)=>
{
    const collection=await db().collection('comments');
    const cover="http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
    const add=await collection.insertOne({book_id:ObjectId(booksID),username:username,comment:userComment,cover:cover});
    return add;
}