const User = require('../models/User');
const passport = require('passport');

User.sync().then(() => {
    console.log('User sync successfull');
}).catch(err => console.log(err));

module.exports.Register = async (req, res) => {
    if(!req.body){
        return res.status(406).json({
            err: "No user provided"
        });
    }

    const {email, password} = req.body;

    try{
        const user = await User.register(email, password);

        res.json({
            user,
            message: "User registered!"
        });

    } catch(err){
        console.log(err);
        res.status(406).json({
            err
        })
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
    console.log(req.session);
    res.send('Logged in');
};

module.exports.Logout = (req, res) => {
    req.logOut();
    res.json({
        message: "Successfully logged out!"
    });
};
