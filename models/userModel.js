const { db } = require('../database/database');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

exports.get = async (id) => {
    const userCollection = db().collection('user');

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    return user;
}

exports.update = async (id,data) => {
    const userCollection = db().collection('user');

    const user = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: data }, function (err, results) { });
    return user;
}

exports.bcryptPassword=async(password)=>
{
    const salt = await bcrypt.genSalt(saltRounds);
    const newPassword = await bcrypt.hash(password, salt);
    return newPassword;
}
exports.add = async (data) => {

    const userCollection = db().collection('user');
   data.password=await this.bcryptPassword(data.password);
    const user = await userCollection.insertOne(data);
    return user;
}

exports.getByUserName = async (username) => {
    const userCollection = db().collection('user');

    const user = await userCollection.findOne({ account: username });
    return user;
}

exports.verificationEmail = async (id) => {
    const userCollection = db().collection('user');
    const data = { active: true };
    const user = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: data }, function (err, results) { });
    return user;
}

exports.checkUsernameExist = async (username) => {
    const userCollection = db().collection('user');

    const count = await userCollection.find({ account: username }).count();
    if (count >= 1)
        return true;
    else
        return false;
}

exports.checkEmailExist = async (email) => {
    const userCollection = db().collection('user');

    const count = await userCollection.find({ email: email }).count();
    if (count >= 1)
        return true;
    else
        return false;
}

exports.checkCredential = async (username, password) => {
    const userCollection = db().collection('user');
    const isUsername = await userCollection.findOne({ account: username });
    if (!isUsername) {
        return false;
    }
    console.log(isUsername);
    let checkPassword = await bcrypt.compare(password, isUsername.password);
    console.log(password);
    console.log(checkPassword);
    if (checkPassword)
        return isUsername;
    return false;
}

exports.checkPassword=async  (user,password)=>
{
    let checkPassword = await bcrypt.compare(password, user.password);
    return checkPassword;
        
}
