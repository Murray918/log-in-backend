const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const credentials = [{
  username: 'Andrew Murray',
  password: '12345678'
}, {
  username: 'Admin',
  password: '0987765'
}]

function loginProof(user, pass) {
  let login = false;
    credentials.forEach( check => {
      if (check.username === user && check.password === pass) {
        login = true;
      }
    });
  return login;
}


app.use(bodyParser.urlencoded({
  extended: false
}));



app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// console.log(req.session);

app.use(function(req, res, next) {
      console.log('in the interceptor');
      if (req.url == '/login') {
        next()
      } else if (!req.session.login) {
          res.render('login')
        } else {
        next()
      }
      })

    app.get('/', function(req, res) {
      res.render('home')
    })


    app.post('/login', function(req, res) {
      console.log('Name is username:' + req.body.username);
      let username = req.body.username;
      console.log('Password is :' + req.body.password);
      let password = req.body.password;

      if (loginProof(username, password)) {
        req.session.login = true;
        req.session.username = username;
        res.redirect('/');
      } else {

        res.render('login', {
          error: 'Bad login'
        });
      }
    });

    app.listen(3000, function() {
      console.log('Successfully started express application!');
    })
