const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

passport.use(
    // Default value is email and password (passing object for clarity)
    new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
            try{
              const user = await User.findOne({where: {email}});

              if(!user){
                  return done(null, false, {message: 'No user found'});
              }

              const isMatch = await bcrypt.compare(password, user.password);
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            }
            catch(e){
                console.log(e);
                return done(e, null);
            }
          
        }
    )
  );

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err, null);
    });
});

  