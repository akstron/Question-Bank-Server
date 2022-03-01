/**
 * Routers related to user authentication
 */

const router = require('express').Router();
const {IsAuthenticated} = require('../config/auth');
const { EditUser } = require('../middlewares/userControl');

router.put('/edit', IsAuthenticated, EditUser);

module.exports = router;