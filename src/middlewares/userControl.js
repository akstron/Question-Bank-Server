const { handleError, ClientError } = require("../utils/errorHandler");
const { updateUser, getStats, sendFriendRequest, acceptFriendRequest, isFriend } = require("../utils/user");

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

module.exports.AcceptFriendRequest = async (req, res) => {
    try{
        const user = req.user;
        const {senderId} = req.body;

        if(!senderId){
            throw new ClientError('Sender id missing');
        }

        await acceptFriendRequest(user, senderId);

        return res.json({
            status: true,
            message: 'Request accepted successfully!'
        });

    } catch(e) {
        handleError(e, res);
    }
}