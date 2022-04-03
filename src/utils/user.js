const User = require("../models/User");
const {ClientError} = require('../utils/errorHandler');

const validUserParameters = ['username', 'fullName', 'bio','email', 'password'];
const validUserUpdateParameters = ['fullName', 'bio', 'password'];
const validStatsType = ['difficulty', 'tag'];

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
        throw new ClientError('Invalid paramenters');
    }

    if('fullName' in updates){
        if (!updates.fullName){
            throw new ClientError("Full name can't be empty");
        }
    }

    for (const [key, value] of Object.entries(updates)) {
        user[key] = value;    
    }

    await user.save();
}

module.exports.registerUser = async (user) => {
    if(!isParametersValid(user, validUserParameters)){
        throw new ClientError('Invalid paramenters');
    }

    const {username, fullName, email, password} = user;
    
    if(!username){
        throw new ClientError("Username can't be empty");
    }

    if(!fullName){
        throw new ClientError("Full name can't be empty");
    }

    if(!email){
        throw new ClientError("Email can't be empty");
    }

    /**
     * TODO: Add checks for password!
     */
    if(!password){
        throw new ClientError("Password can't be empty");
    }

    const userWithEmail = await User.findByEmail(email);

    if(userWithEmail){
        throw new ClientError('Email already registered');
    }

    const userWithUsername = await User.findByUsername(username);

    if(userWithUsername){
        throw new ClientError('Username already exists');
    }

    const registeredUser = await User.register(user);
    const registerdUserObj = {
        username: registeredUser.username,
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        id: registeredUser.id,
        bio: registeredUser.bio
    }
    return registerdUserObj;
}

module.exports.getStats = async (user, statOptions) => {
    if(!Array.isArray(statOptions)){
        throw new ClientError('options should be an array');
    }

    const isValidTypes = statOptions.every((obj) => validStatsType.includes(obj.type));
    if(!isValidTypes){
        throw new ClientError('Invalid statistic types');
    }

    const stats = []; 

    // make database query here
    for(let i = 0; i < statOptions.length; i++){
        if(statOptions[i].type === 'tag'){
            stats.push(await user.findTagStats(statOptions[i].offset, statOptions[i].limit));
        }

        if(statOptions[i].type === 'difficulty'){
            stats.push(await user.findDifficultyStats(statOptions[i].offset, statOptions[i].limit));
        }
    }

    return stats;
}