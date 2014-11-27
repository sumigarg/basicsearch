var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Authenticate via Facebook
passport.use(new FacebookStrategy({
 clientID: config.facebook.clientID,
 clientSecret: config.facebook.clientSecret,
 callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

// Authenticate via Google
passport.use(new GoogleStrategy({
 clientID: config.google.consumerKey,
 clientSecret: config.google.consumerSecret,
 callbackURL: config.google.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

app.use('/', routes);
app.use('/account', routes);
app.use('/users', users);

// Authenticate via Facebook
app.get('/auth/facebook',passport.authenticate('facebook'),
    function(req, res){ 
        console.log('Inside facebook authentication');
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        req.session.user = req.user.username;
        console.log(req.user.username+" "+req);
     res.redirect('/');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email']}),
    function(req, res){
    });
app.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/' }),
    function(req, res) {
        console.log('Redirecting after Google authentication '+req.user.emails[0].value);
        res.redirect('/');
});

app.get('/logout', function(req, res){
    console.log('Loging out the user');
    req.logout();
    console.log('User logged out is: '+req.user);
    res.redirect('/');
});



// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
        res.redirect('/')
    }

function testm(req,res){

    console.log('Inisde method');
    redirect(routes);
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    console.log(err);
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
