/**
 * Routers related to user questions
 */

const router = require('express').Router();
const { IsAuthenticated } = require('../config/auth');
const { AddQuestion, GetQuestions, DeleteQuestion, UpdateQuestion } = require('../middlewares/question');

router.post('/addQuestion', IsAuthenticated, AddQuestion);
router.get('/getQuestions', IsAuthenticated, GetQuestions);
router.delete('/deleteQuestion', IsAuthenticated, DeleteQuestion);
router.put('/updateQuestion', IsAuthenticated, UpdateQuestion);

module.exports = router;