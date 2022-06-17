/**
 * Middlewares related to user authentication
 */

const passport = require('passport');
const { registerUser, createResponseUserObject } = require('../utils/user');
const { handleError } = require('../utils/errorHandler');
const { handleOtpVerification } = require('../utils/opt');

module.exports.Register = async (req, res) => {
    try{
        // console.log(req.body);
        const user = await registerUser(req.body);

        res.json({
            user,
            message: "User registered!",
            status: true
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

        // console.log('info:', info);

        if (!user) {
            return res.json({
                status: false,
                error: 'Wrong email or password'
            }); 
        }

        req.logIn(user, (err) => {
            // console.log(err);
            if (err) {
                return res.status(500).json({
                    status: false,
                    error: 'Something went wrong'
                }); 
            }

            const userObj = {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
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
        status: true,
        message: "Successfully logged out!"
    });
};

module.exports.Me = (req, res) => {
    try{
        const user = req.user;
        const userObj = createResponseUserObject(user);

        return res.json({
            status: true,
            user: userObj
        });
    } catch(e){
        return handleError(e, res);
    }
}

/**
 * Middleware to handle email verification
 */
module.exports.Verify = async (req, res) => {
    try{
        const {otp} = req.body;
        await handleOtpVerification(req.user, otp);
        return res.json({
            status: true,
            message: 'User verified successfully'
        });
    } catch(e){
        return handleError(e, res);
    }
}