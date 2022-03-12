/**
 * Routers related to user authentication
 */

const router = require('express').Router();
const {IsAuthenticated} = require('../config/auth');
const { GetNotifications, DeleteNotification } = require('../middlewares/notification');
const { EditUser } = require('../middlewares/userControl');

router.put('/edit', IsAuthenticated, EditUser);
router.get('/getNotifications', IsAuthenticated, GetNotifications);
router.delete('/deleteNotification', IsAuthenticated, DeleteNotification);

module.exports = router;