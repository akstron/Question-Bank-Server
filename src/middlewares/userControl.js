const { handleError, ClientError } = require("../utils/errorHandler");
const { updateUser, getStats, sendFriendRequest, acceptFriendRequest, isFriend, rejectFriendRequest, getFriends, getUserById, getUsers } = require("../utils/user");

module.exports.EditUser = async (req, res) => {
    const { updates } = req.body;
    if(!updates){
        return res.status(400).json({
            status: false,
            error: 'No updates provided'
        });
    }

    try{
        await updateUser(updates, req.user);

        return res.json({
            status: true,
            message: 'User updated'
        });
    } catch(e){
       return handleError(e, res);
    }
}

module.exports.GetStats = async (req, res) => {
    try{
        var options;
        try{
            options = JSON.parse(req.query.options);
        }
        catch(e){
            console.log(e);
            return res.status(400).json({
                status: false,
                error: 'Incorrect query string'
            });
        }

        if(!Array.isArray(options)){
            throw new ClientError('stats should be an array');
        }

        const result = await getStats(req.user, options);
        return res.json({
            status: true,
            stats: result
        })
    }
    catch(e){
        return handleError(e, res);
    }
}

module.exports.SendFriendRequest = async (req, res) => {
    try{
        const user = req.user;
        const { receiverId } = req.body;

        if(!receiverId){
            throw new ClientError('No receiver id');
        }

        if(receiverId === user.id){
            throw new ClientError("Can't send request to yourself");
        }

        const isAlreadyFriend = await isFriend(user.id, receiverId);
        
        if(isAlreadyFriend){
            throw new ClientError("Can't send a friend request to a friend");
        }

        await sendFriendRequest(user, receiverId);

        return res.json({
            status: true,
            message: 'Request sent successfully!'
        });

    } catch(e) {
        handleError(e, res);
    }
}

module.exports.RespondFriendRequest = async (req, res) => {
    try{
        const user = req.user;
        const {senderId, response} = req.body;

        if(!senderId){
            throw new ClientError('Sender id missing');
        }

        if(!response){
            throw new ClientError('No response found');
        }

        if(response === 'accept'){
            await acceptFriendRequest(user, senderId);
        } else if (response === 'reject'){
            await rejectFriendRequest(user, senderId);
        } else {
            throw new ClientError('Response can only be accept or reject');
        }

        return res.json({
            status: true,
            message: 'Responded successfully!'
        });

    } catch(e) {
        handleError(e, res);
    }
}

module.exports.GetFriends = async (req, res) => {
    try{
        const user = req.user;
        const {prefixEmail, prefixFullName, prefixUsername, limit, offset} = req.query;
        const friends = await getFriends(user, prefixFullName, prefixUsername, prefixEmail, offset, limit);
        return res.json({
            status: true, 
            message: 'Friends found successfully',
            friends
        });
    } catch(e){
        handleError(e, res);
    }
}

module.exports.GetUser = async (req, res) => {
    try{
        const { id } = req.query;
        const user = await getUserById(id);
        return res.json({
            status: true,
            message: "User found successfully", 
            user
        });

    } catch (e){
        handleError(e, res);
    }
}

module.exports.GetUsers = async (req, res) => {
    try{
        const {prefixEmail, prefixFullName, prefixUsername, limit, offset} = req.query;
        const users = await getUsers(prefixFullName, prefixUsername, prefixEmail, offset, limit);
        return res.json({
            status: true,
            message: 'Users found successfully',
            users
        });

    } catch (e) {
        handleError(e, res);
    }
}