// include modules
var bodyParser          = require('body-parser');
var cookieParser        = require('cookie-parser');
var express             = require('express');
var LocalStrategy       = require('passport-local').Strategy;
var passport            = require('passport');
var session             = require('express-session');

// initialize express app
var app = express();
const users = {};
// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {

    //done is a function that returns an error, then  the userobject
    if ((username && password) && !users[username]){
      users[username] = {
        username: username,
        password: password,
        pairs: {}
      };
      return done(null, { username: username, password: password, pairs: {} });
    }
    else {
      return done(null, users[username]);
    }

}));

// tell passport how to turn a user into serialized data that will be stored with the session
//user object is generated above
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(key, done) {
    done(null, users[key]);
});

// tell the express app what middleware to use
//from bytes to useable data.
app.use(bodyParser.urlencoded({ extended: true }));

//turns cookies into objects with key value pairs
app.use(cookieParser());

//keeps track of who is logged in.
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));

//runs req, res, and next through middleware (serialize, etc.)
app.use(passport.initialize());
app.use(passport.session());




app.get('/health', function (req, res) {
    res.sendStatus(200);
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.status(200).send(req.user.pairs);
});

app.get('/logout', function(req, res){
    req.logout();
    res.sendStatus(200);
});

app.get('/', function(req, res){
    if(!req.user){
      res.sendStatus(401);
    }
    else {
      res.send(req.user.pairs);
    }
})
.put('/', function(req, res){
  if(!req.user){
    res.sendStatus(401);
  }
  else {
    users[req.user.username].pairs[req.query.key] = req.query.value;
    res.send(req.user.pairs);
  }
});

app.delete('/', function(req, res){
  if(!req.user){
    res.sendStatus(401);
  }
  else {
    delete users[req.user.username].pairs[req.query.key];
    return res.send(req.user.pairs);
  }
     //If the user is not logged in, will produce a 401 response. If the user is logged in, will delete the key and it's associated value and then will return all of the user's current key value pairs.
});

// specify a URL that only authenticated users can hit
app.get('/protected',
    function(req, res) {
        if (!req.user) return res.sendStatus(401);
        res.send('You have access.');
    }
);

// specify the login url
app.put('/auth',
    passport.authenticate('local'),
    function(req, res) {
        res.send('You are authenticated, ' + req.user.username);
    });

// log the user out
app.delete('/auth', function(req, res) {
    req.logout(); //kill the cookie on the browser
    res.send('You have logged out.');
});

// start the server listening
app.listen(3000, function () {
    console.log('Server listening on port 3000.');
});
