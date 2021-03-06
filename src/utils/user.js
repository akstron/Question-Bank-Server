const FriendMap = require("../models/FriendMap");
const Otp = require("../models/Otp");
const User = require("../models/User");
const {ClientError} = require('../utils/errorHandler');
const { handleOtp } = require("./opt");
const { createResponseQuestionObject } = require("./question");
const { isUUIDv4 } = require("./validator");

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

    if(userWithEmail && userWithEmail.isVerified){
        throw new ClientError('Email already registered');
    }

    /**
     * If user is found unverified, delete the user and create new user
     */
    if(userWithEmail){
        /*This will also destrop otp automatically due to cascade */
        await userWithEmail.destroy();
    }

    const userWithUsername = await User.findByUsername(username);

    if(userWithUsername){
        throw new ClientError('Username already exists');
    }
    
    const registeredUser = await User.register(user);
    await handleOtp(registeredUser);
    const registerdUserObj = this.createResponseUserObject(registeredUser);
    return registerdUserObj;
}

/**
 * Get statistics of any user here using userId
 */
module.exports.getStats = async (userId, statOptions) => {
    if(!Array.isArray(statOptions)){
        throw new ClientError('options should be an array');
    }

    const isValidTypes = statOptions.every((obj) => validStatsType.includes(obj.type));
    if(!isValidTypes){
        throw new ClientError('Invalid statistic types');
    }

    const user = await User.findByPk(userId);

    if(!user){
        throw new ClientError("Invalid user");
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

module.exports.sendFriendRequest = async (from, toId) => {
    if(!from){
        throw new ClientError('No sender found');
    }

    if(!isUUIDv4(toId)){
        throw new ClientError('Invalid receiver id');
    }

    /**
     * TODO: SEND NOTIFICATION
     */

    const isFriendRequestAlreadySent = await from.isFriendRequestSent(toId);
    if(isFriendRequestAlreadySent){
        throw new ClientError('Friend request already sent');
    }

    return from.addFriendRequest(toId);
}

module.exports.unsendFriendRequest = async (from, toId) => {
    if(!from){
        throw new ClientError('No sender found');
    }

    if(!isUUIDv4(toId)){
        throw new ClientError('Invalid receiver id');
    }

    const isFriendRequestSent = await from.isFriendRequestSent(toId);
    if(!isFriendRequestSent){
        throw new ClientError('Friend request not sent');
    }

    const otherUser = await User.findByPk(toId);
    if(!otherUser){
        throw new ClientError('Invalid user');
    }

    return otherUser.removeFriendRequest(from.id);
}

module.exports.acceptFriendRequest = async (to, fromId) => {
    if(!to){
        throw new ClientError('No receiver found');
    }

    if(!isUUIDv4(fromId)){
        throw new ClientError('Invalid sender id');
    }

    const from = await User.findByPk(fromId);
    const toId = to.id;

    const isFriendRequestSent = await from.isFriendRequestSent(toId);
    if(!isFriendRequestSent){
        throw new ClientError('No friend request found');
    }

    await to.removeFriendRequest(fromId);
    return to.addFriend(fromId);
}

module.exports.rejectFriendRequest = async (to, fromId) => {
    if(!to){
        throw new ClientError('No receiver found');
    }

    if(!isUUIDv4(fromId)){
        throw new ClientError('Invalid sender id');
    }

    const from = await User.findByPk(fromId);
    const toId = to.id;

    const isFriendRequestSent = await from.isFriendRequestSent(toId);
    if(!isFriendRequestSent){
        throw new ClientError('No friend request found');
    }

    return to.removeFriendRequest(fromId);
}

module.exports.removeFriend = async (user, friendId) => {
    if(!user){
        throw new ClientError('No receiver found');
    }

    if(!isUUIDv4(friendId)){
        throw new ClientError('Invalid friend id');
    }

    const isFriend = await FriendMap.isFriend(user.id, friendId);
    if(!isFriend){
        throw new ClientError('No friend found');
    }

    return user.removeFriend(friendId);
}

module.exports.getFriends = async (user, prefixFullName, prefixUsername, prefixEmail, offset, limit) => {
    return user.findFriends(prefixFullName, prefixUsername, prefixEmail, offset, limit);
}

module.exports.isFriend = async (userId1, userId2) => {
    return FriendMap.isFriend(userId1, userId2);
}

module.exports.createResponseUserObject = (user, additionalData = {}) => {
    return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        ...additionalData
    };
}

module.exports.getUserById = async (id) => {
    return User.findByPk(id);
}

module.exports.getUsers = async (prefixFullName, prefixUsername, prefixEmail, offset, limit) => {
    return User.findByPrefixTexts(prefixFullName, prefixUsername, prefixEmail, offset, limit);
}

module.exports.getFriendshipStatus = async (currentUser, otherUser) => {
    const isFriend = await FriendMap.isFriend(currentUser.id, otherUser.id);
    if(isFriend) return 'friend';

    const requestFromCurrentToOther = await currentUser.isFriendRequestSent(otherUser.id);
    if(requestFromCurrentToOther){
        return 'friend request sent';
    }

    const requestFromOtherToCurrent = await otherUser.isFriendRequestSent(currentUser.id);
    if(requestFromOtherToCurrent){
        return 'friend request received';
    }

    return 'not friend';
}