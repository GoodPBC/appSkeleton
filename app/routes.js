var User = require('./models/user');
//var User = require('./models/locate');
module.exports = function(app, passport){

    app.get('/', function(req, res){
        res.render('index.ejs');
    });
    //renders login.ejs and shows error messages
    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    //post route for passport local-login strategy (passport.js)
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res){
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    //post route for passport local-login strategy (passport.js)
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    //profile page for auth'd users
    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user });  //renders using info from user
    });



    //facebook auth route
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    //facebook auth callback route
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));


    //logout route
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};

//middleware function to check for auth logic
//duplicate logic in future for different auth use cases
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    //need to build a page to send them to an account generation page
    res.redirect('/login');
}