/**
 * Routers related to user control and details
 */

const router = require('express').Router();
const {IsAuthenticated} = require('../config/auth');
const { GetNotifications, DeleteNotification } = require('../middlewares/notification');
const { EditUser, GetStats, SendFriendRequest, AcceptFriendRequest } = require('../middlewares/userControl');

router.put('/edit', IsAuthenticated, EditUser);
router.get('/getNotifications', IsAuthenticated, GetNotifications);
router.delete('/deleteNotification', IsAuthenticated, DeleteNotification);
/* 
    QueryString: [{type, offset, limit}]

    // type = {difficulty, tag}
    returns in sorted order
*/
router.get('/getStats', IsAuthenticated, GetStats);
router.post('/sendFriendRequest', IsAuthenticated, SendFriendRequest);
router.post('/acceptFriendRequest', IsAuthenticated, AcceptFriendRequest);

module.exports = router;