var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('../controllers/userCtrl.js');

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log("aaaaaaaaaa")
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    User.findById({id: user._id}, function (err, user) {
      if (err) return done(err);
      done(null, user);
    })
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findByEmail({email: username}, function (err, user) {
        if (err) return done(err);

        if (!user) {
          return done('not_found')
        } else if (password == user.password) {
          return done(null, user);  
        } else {
          return done('wrong password')
        }
        
      })
    }
  ))

  app.post('/api/auth/login', function (req, res) {
    console.log("Here");
    passport.authenticate('local', function (err, user) {
      if (err) {return res.status(500).send(err)}

      if (!user) {return res.status(500).send('not_found')};

      req.logIn(user, function (err) {
        if (err) {return res.status(500).send(err)};
        return res.send(user.fullJSON());
      })
    })(req, res);
  })

  app.post('/api/auth/logged', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.user)
    {
        req.user.password = null;
        return res.end(JSON.stringify({data: req.user}));
    }

    res.end(JSON.stringify({data: null}));
  })

  app.post('/api/auth/logout', function (req, res) {
    if (req.user)
    {
        req.logout();
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({data: true}));
  })
}
