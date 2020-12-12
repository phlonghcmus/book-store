const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


const userModel = require('../../models/userModel');
passport.use(new LocalStrategy(
    async function (username, password, done) {
        const user = await userModel.checkCredential(username, password);
        if (!user)
            return done(null, false, { message: 'Username hoặc Password không đúng' })
        if (!user.active)
            return done(null, false, { message: 'Email bạn chưa được kích hoạt' })
        return done(null, user);
    }
));


passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    userModel.get(id).then((user) => {
        done(null, user);
    })
});


module.exports = passport;