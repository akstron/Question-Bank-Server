const { handleError, ClientError } = require("../utils/errorHandler");
const { updateUser, getStats } = require("../utils/user");

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
        console.log(e);
        if(!e.error){
            return res.status(500).json({
                status: false,
                error: 'Something went wrong'
            });
        }

        return res.status(400).json({
            status: false,
            error: e.error
        })
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