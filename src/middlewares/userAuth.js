const User = require('../models/User');
const passport = require('passport');
const { registerUser } = require('../utils/user');

User.sync().then(() => {
    console.log('User sync successfull');
}).catch(err => console.log(err));

module.exports.Register = async (req, res) => {
    try{
        // const user = await User.register(email, password);

        const userId = await registerUser(req.body);

        res.json({
            userId,
            message: "User registered!"
        });

    } catch(e){
        console.log(e);
        if(!e.error){
            return res.status(406).json({
                status: false, 
                error: 'Something went wrong'
            });
        }

        return res.status(406).json({
            status: false,
            error: e.error
        });
    }
};


module.exports.Login = (req, res, next) => {
    console.log('loginRouter')

    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            return res.status(500).json({
                err: info
            })
        }

        console.log('info:', info);

        if (!user) {
            return res.json({
                message: info
            }); 
        }

        req.logIn(user, (err) => {
          if (err) {
               return res.status(500).json({
                    err
               }); 
            }

          return res.status(202).json({
                "user": req.user,
                message: 'Logged in successfully'
          })
        });
      })(req, res, next);

};

module.exports.CheckLoggedIn =  (req, res) => {
    // console.log(req.session);
    res.send('Logged in');
};

module.exports.Logout = (req, res) => {
    req.logOut();
    res.json({
        message: "Successfully logged out!"
    });
};
