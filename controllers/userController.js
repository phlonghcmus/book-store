const userModel=require('../models/userModel');
const fs = require('fs');
exports.signup=(req,res,next) =>
{
    res.render('user/signup');
}

exports.login=(req,res,next) =>
{
    res.render('user/login');
}


exports.profile=async (req,res,next)=>
{
    const user=await userModel.get();
    res.render('user/profile',{
        firstName:user.firstName,
        lastName: user.lastName,
        password:user.password,
        mobile:user.mobile,
        phone:user.phone,
        location:user.location,
        email:user.email,
        cover:user.cover});
}

exports.profileUpdate=async (req,res,next)=>
{
    let cover;
    let data;
    const user=await userModel.get();
    if(req.file)
    {
        console.log(req.file);
        let oldCover = user.cover;
        if(oldCover){
            oldCover = oldCover.split('/').slice(2);
            const path = '/';
            const oldCoverPath = req.file.destination +oldCover;
            if(fs.existsSync(oldCoverPath))
            fs.unlinkSync(oldCoverPath);
        }
        cover=req.file.destination + req.file.filename;
        const path=cover.split('/').slice(1).join('/');
        const path2="/";
        cover=path2.concat(path);
        data={
            firstName:user.firstName,
            lastName: user.lastName,
            password:user.password,
            mobile:user.mobile,
            phone:user.phone,
            location:user.location,
            email:user.email,
            cover:cover
        };
    }
    else
    {
        data={
            firstName:user.firstName,
            lastName: user.lastName,
            password:user.password,
            mobile:user.mobile,
            phone:user.phone,
            location:user.location,
            email:user.email,
        };
    }
    await userModel.update(data);
    res.redirect('/users/profile');
}