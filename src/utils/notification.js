const Notification = require('../models/Notification');
const { isUUID } = require('validator');

module.exports.addShareQuestionNotification = async (questionOwner, qeustionReceiver, question) => {
    const notification = await Notification.addNotification(qeustionReceiver.id, {
        title: 'Shared Question',
        type: 'question share',
        content: `${questionOwner.username} has shared question ${question.name}`
    });

    return notification;
}

module.exports.getUserNotificationFromDB = async (notificationId, user) => {
    if(!notificationId){
        throw {
            status: false,
            error: 'Notification id missing'
        }
    }

    if(!isUUID(notificationId, [4])){
        throw {
            status: false,
            error: 'Invalid notification id'
        };
    }

    const notification = await Notification.findByPk(notificationId);

    if(!notification){
        throw {
            status: false,
            error: 'Notification not found!'
        };
    }

    if(notification.UserId !== user.id){
        throw {
            status: false,
            error: 'Notification not found!!'
        };
    }

    return notification;
}