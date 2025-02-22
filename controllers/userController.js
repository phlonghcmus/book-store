const userModel = require('../models/userModel');
const fs = require('fs');
const url = require('url');
const mailer = require('../utils/mailer/mailer');
const { isBuffer } = require('util');
const orderModel=require('../models/orderModel');
const cloudinary = require('cloudinary');
require('../handlers/cloudinary')

exports.signup = (req, res, next) => {
    if (req.user)
        res.redirect('/');
    else
        res.render('index/signup');
}

exports.login = (req, res, next) => {
    if (req.user)
        res.redirect('/');
    else {
        const message = req.flash('error');
        res.render('index/login', { message });
    }
}


exports.profile = async (req, res, next) => {
    if (req.user) {
        const user = req.user;
        res.render('user/profile', {
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            mobile: user.mobile,
            phone: user.phone,
            location: user.location,
            email: user.email,
            cover: user.cover
        });
    }
    else {
        res.redirect('/');
    }
}

exports.profileUpdate = async (req, res, next) => {
    if (req.user) {
        let cover;
        let data;
        const user = req.user
        console.log(req.body);
        if (req.file) {

            cover = await cloudinary.v2.uploader.upload(req.file.path);
            let oldCoverId = user.cover_id;
            if(oldCoverId){
                let result = await cloudinary.v2.uploader.destroy(oldCoverId);
                console.log(result);
            }
            coverPath = req.file.destination + req.file.filename;
            if(fs.existsSync(coverPath))
        	    fs.unlinkSync(coverPath);
            console.log(req.file);
            data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                phone: req.body.phone,
                location: req.body.location,
                email: req.body.email,
                cover: cover.secure_url,
                cover_id: cover.public_id,
            };
        }
        else {
            data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                phone: req.body.phone,
                location: req.body.location,

            };
        }
        await userModel.update(req.user._id, data);
        res.redirect('/users/profile');
    }
    else {
        res.redirect('/');
    }
}


exports.signupSuccess = async (req, res, next) => {
    const data = {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        account: req.body.username,
        location:req.body.location,
        password: req.body.password,
        email: req.body.email,
        mobile: req.body.phone,
        gender: req.body.gender,
        cover: "http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
        active: false,
        block:false
    };
    await userModel.add(data);
    const user = await userModel.getByUserName(req.body.username);
    const url = req.headers.host + "/users/verification/" + user._id;
    const to = req.body.email;
    const subject = "Xác nhận email";
    //    const body= '<p>Bấm <a href="http://' + url + '">vào đây</a> để xác thực email của bạn</p>'
    const htmlfile = await fs.readFileSync(__dirname + "/../utils/mailer/emailTemplate.html", { encoding: "utf-8" });
    const body = await mailer.readHTML(htmlfile, req.body.username, req.body.email, url);
    await mailer.sendMail(to, subject, body);

    res.render("user/verification-email", { account: req.body.username, email: req.body.email });
}

exports.verification = async (req, res, next) => {
    await userModel.verificationEmail(req.params.id);
    const user = await userModel.get(req.params.id);
    res.render("user/verification-success", { account: user.account, email: user.email });
}

exports.logout = async (req, res, next) => {
    if (req.user) {
        req.logout();
        res.redirect('/login');
    }
    else {
        res.redirect('/');
    }
}

exports.changePasswordPage = async (req, res, next) => {
    if (req.user)
        res.render('user/change-password');
    else
        res.redirect('/');
}

exports.changePassword = async (req, res, next) => {
    if (req.user) {
        const user = await req.user;
        const password = req.body.newPassword;
        const newPassword = await userModel.bcryptPassword(password);
        const data =
        {
            password: newPassword
        };
        await userModel.update(user._id, data);
        res.redirect('/users/logout');
    }
    else
        res.redirect('/');
}

exports.recoverPage = async (req, res, next) => {
    res.render("index/recover");
}

exports.sendRecoverMail = async (req, res, next) => {
    const user = await userModel.getByEmail(req.body.email);
    const url = req.headers.host + "/users/recover/" + user._id;
    const to = req.body.email;
    const subject = "Khôi phục tài khoản";

    const htmlfile = await fs.readFileSync(__dirname + "/../utils/mailer/recoverTemplate.html", { encoding: "utf-8" });
    const body = await mailer.readHTML(htmlfile, user.account, user.email, url);
    await mailer.sendMail(to, subject, body);
    res.render("index/recover", { notification: "Đã gửi email khôi phục thành công" });
}

exports.recoverPasswordPage = async (req, res, next) => {
    const id = req.params.id;
    const user = await userModel.get(id);
    res.render("user/recover-password", { id: id, account: user.account });
}

exports.recover = async (req, res, next) => {
    const id = req.params.id;
    const password = req.body.newPassword;
    const newPassword = await userModel.bcryptPassword(password);
    const data =
    {
        password: newPassword
    };
    await userModel.update(id, data);
    res.redirect('/login');
}

exports.historyOrderPage=async(req,res,next)=>
{
    const orders=await orderModel.getByUserId(req.user._id);
    const all=await orderModel.countUserOrder(req.user._id);
    const confirmed=await orderModel.countUserOrderByStatus(req.user._id,1);
    const temp1=await orderModel.countUserOrderByStatus(req.user._id,2);
    const temp2=await orderModel.countUserOrderByStatus(req.user._id,3);
    const process=temp1+temp2;
    const finish=await orderModel.countUserOrderByStatus(req.user._id,4);
    const cancel=await orderModel.countUserOrderByStatus(req.user._id,5);
  
    res.render('user/orders-history',{orders,all,confirmed,process,finish,cancel});
}

exports.historyOrderDetail=async(req,res,next)=>
{
    const id=req.params.id;
    const order=await orderModel.getOrderDetailById(id);
   
    res.render('user/order-detail',{order});
}

