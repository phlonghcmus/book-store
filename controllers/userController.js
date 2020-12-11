const userModel=require('../models/userModel');
const fs = require('fs');
const url = require('url');
const mailer=require('../utils/mailer');

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


exports.signupSuccess=async (req,res,next)=>
{
    const data={
        account:req.body.username,
        password:req.body.password,
        email:req.body.email,
        mobile:req.body.phone,
        gender:req.body.gender,
        cover:"http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
        active:false
    };
    await userModel.add(data);
    const user=await userModel.getByUserName(req.body.username);
    const url=req.headers.host +"/users/verification/"+user._id;
    const to=req.body.email;
    const subject="Xác nhận email";
//    const body= '<p>Bấm <a href="http://' + url + '">vào đây</a> để xác thực email của bạn</p>'
    const htmlfile= await fs.readFileSync(__dirname+"/../utils/emailTemplate.html",{ encoding: "utf-8" });
    const body=await mailer.readHTML(htmlfile,req.body.username,req.body.email,url);
    await mailer.sendMail(to,subject,body);
   
    res.render("user/verificationEmail",{account: req.body.username, email:req.body.email});
}

exports.verification=async (req,res,next)=>
{
    await userModel.verificationEmail(req.params.id);
    const user=await userModel.get(req.params.id);
    res.render("user/verificationSuccess", {account: user.account,email: user.email});
}