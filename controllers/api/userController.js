const userModel=require("../../models/userModel");
const orderModel=require("../../models/orderModel");

exports.usernameIsExist=async(req,res,next)=>
{
   res.json(await userModel.checkUsernameExist(req.query.username));

}

exports.emailIsExist=async(req,res,next)=>
{
   res.json(await userModel.checkEmailExist(req.query.email));

}

exports.passwordIsExist=async(req,res,next)=>
{
   const user=req.user;
   const checkPassword=await userModel.checkPassword(user,req.query.password);
   res.json(checkPassword);
}

exports.recoverPasswordIsExist=async(req,res,next)=>
{
   const user=await userModel.get(req.query.id);
   const checkPassword=await userModel.checkPassword(user,req.query.password);
   res.json(checkPassword);
}

exports.cancelOrder=async(req,res,next)=>
{
   const newStatus=await orderModel.cancelOrder(req.query.id);
   res.json(newStatus);
}

exports.reOrder=async(req,res,next)=>
{
   const newStatus=await orderModel.reOrder(req.query.id);
   res.json(newStatus);
}

exports.getOrderStatus=async(req,res,next)=>
{
   let orders;
   let status=parseInt(req.query.status);
   const user=req.user._id;
   if(status==0)
      orders=await orderModel.getByUserId(user);
   else
      orders=await orderModel.getOrderByStatus(user,status);
   res.json(orders);
}
