const userModel = require('../models/userModel');
const fs = require('fs');
const url = require('url');
const mailer = require('../utils/mailer/mailer');
const { isBuffer } = require('util');

exports.signup = (req, res, next) => {
    res.render('index/signup');
}

exports.login = (req, res, next) => {
    const message = req.flash('error');
    res.render('index/login', { message });
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

            let oldCover = user.cover;
            if (oldCover) {
                oldCover = oldCover.split('/').slice(2);
                const path = '/';
                const oldCoverPath = req.file.destination + oldCover;
                if (fs.existsSync(oldCoverPath))
                    fs.unlinkSync(oldCoverPath);
            }
            cover = req.file.destination + req.file.filename;
            const path = cover.split('/').slice(1).join('/');
            const path2 = "/";
            cover = path2.concat(path);
            data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobile: req.body.mobile,
                phone: req.body.phone,
                location: req.body.location,
                email: req.body.email,
                cover: cover
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
        firstName: "",
        lastName: "",
        account: req.body.username,
        password: req.body.password,
        email: req.body.email,
        mobile: req.body.phone,
        gender: req.body.gender,
        cover: "http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
        active: false
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

exports.recoverPage = async (req, res, next) =>
{
    res.render("index/recover");
}

exports.sendRecoverMail = async (req, res, next) =>
{
    const user = await userModel.getByEmail(req.body.email);
    const url = req.headers.host + "/users/recover/" + user._id;
    const to = req.body.email;
    const subject = "Khôi phục tài khoản";
    
    const htmlfile = await fs.readFileSync(__dirname + "/../utils/mailer/recoverTemplate.html", { encoding: "utf-8" });
    const body = await mailer.readHTML(htmlfile, user.account, user.email, url);
    await mailer.sendMail(to, subject, body);
    res.render("index/recover",{notification: "Đã gửi email khôi phục thành công"});
}

exports.recoverPasswordPage= async (req, res, next) =>
{
    const id= req.params.id;
    const user=await userModel.get(id);
    res.render("user/recover-password",{id:id,account:user.account});
}

exports.recover= async (req, res, next) =>
{
    const id=req.params.id;
    const password=req.body.newPassword;
    const newPassword= await userModel.bcryptPassword(password);
    const data =
    {
        password: newPassword
    };
    await userModel.update(id, data);
    res.redirect('/login');
}

