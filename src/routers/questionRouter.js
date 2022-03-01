/**
 * Routers related to user questions
 */

const router = require('express').Router();
const { IsAuthenticated } = require('../config/auth');
const { AddQuestion, GetQuestions, DeleteQuestion, UpdateQuestion, GetTaggedQuestions, GetQuestion, ShareQuestion, UnshareQuestion } = require('../middlewares/question');
const { AddTag, AddQuestionTag, DeleteQuestionTag } = require('../middlewares/tag');

router.post('/addQuestion', IsAuthenticated, AddQuestion);
router.get('/getQuestion/:questionId', IsAuthenticated, GetQuestion);
router.get('/getQuestions', IsAuthenticated, GetQuestions);
router.delete('/deleteQuestion', IsAuthenticated, DeleteQuestion);
router.put('/updateQuestion', IsAuthenticated, UpdateQuestion);
router.post('/addTag', IsAuthenticated, AddTag);
/**
 * UPDATE QUERY TO GET TAGGED QUESTIONS OF PARTICULAR USER
 */
router.get('/getTaggedQuestions', IsAuthenticated, GetTaggedQuestions);
router.put('/addQuestionTags', IsAuthenticated, AddQuestionTag);
router.delete('/deleteQuestionTags', IsAuthenticated, DeleteQuestionTag);
router.post('/shareQuestion', IsAuthenticated, ShareQuestion);
router.post('/unshareQuestion', IsAuthenticated, UnshareQuestion);


module.exports = router;