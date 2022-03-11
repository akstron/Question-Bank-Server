const Notification = require("../models/Notification");
const { handleError } = require("../utils/errorHandler")

module.exports.GetNotifications = async (req, res) => {
    try{
        const user = req.user;
        const limit = req.query.limit || 1

        const notifications = await Notification.findAll({
            attributes: [
                'id', 'title', 'type', 'content', 'createdAt'
            ],
            where: {
                UserId : user.id
            },
            order:[
                // This gives latest notifications
                ['createdAt', 'DESC']
            ],
            limit
        });

        return res.json({
            status: true,
            notifications
        });
    }
    catch(e){
        return handleError(e, res);
    }
}