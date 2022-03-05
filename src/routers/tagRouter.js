/**
 * Tag relater routers
 */

const router = require('express').Router();
const { IsAuthenticated } = require('../config/auth');
const { GetSearchTags } = require('../middlewares/tag');

router.get('/getSearchTags', IsAuthenticated, GetSearchTags);

module.exports = router;