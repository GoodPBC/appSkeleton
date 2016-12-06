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

    app.get('/historic', isLoggedIn, function(req, res){
        res.render('historic.ejs', { user: req.user });  //renders using info from user
    });

    //facebook auth route
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    //facebook auth callback route
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/map', isLoggedIn, function (req, res) {
        res.render('map.ejs', { user: req.user });
    });

    // app.get('/users', function(req, res) {
    //    var query = MapUser.find({});
    //     query.exec(function(err, users){
    //         if(err)
    //             res.send(err);
    //
    //         // If no errors are found, it responds with a JSON of all users. future should respond with a list of all users
    //         res.json(users);
    //     });
    // });

    app.post('/users', function(req, res) {
        var newuser = new MapUser(req.body);
        newuser.save(function (err) {
            if (err)
                res.send(err);
            res.json(req.body);

        });
    });

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