/**
 * Routers related to user authentication
 */

const router = require('express').Router();
const {Register, Login, Logout, CheckLoggedIn, Me, Verify} = require('../middlewares/userAuth');
const {IsAuthenticated} = require('../config/auth');

/**
 * TODO: Add checks for password!
 */
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', IsAuthenticated, Logout);
router.get('/me', IsAuthenticated, Me);
router.post('/verify', IsAuthenticated, Verify);
router.get('/checkLoggedIn', IsAuthenticated, CheckLoggedIn);

module.exports = router;