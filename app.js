create a login and register using express methods using passport,  passport-local, passpost-local-mongoose npm paackages


//Create express instance
const express = require('express');
const app = express();

//Require necessary packages 
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//Connect to MongoDB
mongoose.connect('mongodb://localhost/user_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Schema for user
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Add passport-local-mongoose to userSchema
userSchema.plugin(passportLocalMongoose);

//Create User model 
const User = mongoose.model('User', userSchema);

//Passport Configuration
app.use(session({
    secret: "Some secret phrase",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes

//Register Route
app.get('/register', (req, res) => {
    res.render('register');
});

//Create User
app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/secret');
        });
    });
});

//Login Route
app.get('/login', (req, res) => {
    res.render('login');
});

//Authenticate User
app.post('/login', passport.authenticate("local", {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {

});

//Logout Route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//Secret Page
app.get('/secret', (req, res) => {
    if(req.isAuthenticated()){
        res.render('secret');
    } else {
        res.redirect('/login');
    }
});

//Start server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
