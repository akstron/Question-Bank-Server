const User = require("../models/User");

const validUserParameters = ['username', 'fullName', 'bio','email', 'password'];
const validUserUpdateParameters = ['fullName', 'bio', 'password'];

const isParametersValid = (obj, arr) => {
    const keys = Object.keys(obj);
    const isValid = keys.every((key) => arr.includes(key));
    return isValid;
}

/**
 * TODO: CHECK PASSWORD UPDATES
 */
module.exports.updateUser = async (updates, user) => {
    if(!isParametersValid(updates, validUserUpdateParameters)){
        throw {
            status: false,
            error: 'Invalid parameters'
        };
    }

    if('fullName' in updates){
        if (!updates.firstName){
            throw {
                status: false,
                error: "first name can't be empty" 
            };
        }
    }

    for (const [key, value] of Object.entries(updates)) {
        user[key] = value;    
    }

    await user.save();
}

module.exports.registerUser = async (user) => {
    if(!isParametersValid(user, validUserParameters)){
        throw {
            status: false,
            error: 'Invalid parameters'
        };
    }

    const {username, fullName, email, password} = user;
    
    if(!username){
        throw {
            status: false,
            error: "username can't be empty"
        };
    }

    if(!fullName){
        throw {
            status: false,
            error: "first name can't be empty"
        }
    }

    if(!email){
        throw {
            status: false,
            error: "email can't be empty"
        }
    }

    /**
     * TODO: Add checks for password!
     */
    if(!password){
        throw {
            status: false,
            error: "password can't be empty"
        };
    }

    const userWithEmail = await User.findOne({
        where: {
            email
        }
    });

    if(userWithEmail){
        throw {
            status: false,
            error: 'Email already registered'
        }
    }

    const userWithUsername = await User.findOne({
        where: {
            username
        }
    });

    if(userWithUsername){
        throw {
            status: false,
            error: 'Username already exists'
        };
    }

    const userId = await User.register(user);
    return userId;
}