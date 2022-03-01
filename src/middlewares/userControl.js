const { updateUser } = require("../utils/user");

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