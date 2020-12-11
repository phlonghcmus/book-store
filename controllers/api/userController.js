const userModel=require("../../models/userModel");

exports.usernameIsExist=async(req,res,next)=>
{
   res.json(await userModel.checkUsernameExist(req.query.username));

}

exports.emailIsExist=async(req,res,next)=>
{
   res.json(await userModel.checkEmailExist(req.query.email));

}

