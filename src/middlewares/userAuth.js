const User = require('../models/User');
const passport = require('passport');
const { registerUser } = require('../utils/user');
const { handleError } = require('../utils/errorHandler');

User.sync().then(() => {
    console.log('User sync successfull');
}).catch(err => console.log(err));

module.exports.Register = async (req, res) => {
    try{
        const userId = await registerUser(req.body);

        res.json({
            userId,
            message: "User registered!"
        });

    } catch(e){
        handleError(e, res);
    }
};


module.exports.Login = (req, res, next) => {
    console.log('loginRouter')

    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            return res.status(500).json({
                status: false,
                error: 'Something went wrong'
            })
        }

        console.log('info:', info);

        if (!user) {
            return res.json({
                status: false,
                error: 'Wrong email or password'
            }); 
        }

        req.logIn(user, (err) => {
            console.log(err);
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: 'Something went wrong'
                }); 
            }

            const userObj = {
                id: user.id,
                username: user.username,
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email,
                bio: user.bio
            };

            return res.status(202).json({
                user : userObj,
                status: true,
                message: 'Logged in successfully'
            });
        });
      })(req, res, next);

};

module.exports.CheckLoggedIn =  (req, res) => {
    res.send('Logged in');
};

module.exports.Logout = (req, res) => {
    req.logOut();
    res.json({
        message: "Successfully logged out!"
    });
};
