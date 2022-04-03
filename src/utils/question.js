const Question = require('../models/Question');
const { isUUID } = require('validator');
const { ClientError } = require('./errorHandler');
const validQuestionParameters = ['url', 'name', 'notes', 'tags', 'difficulty'];

module.exports.isValidQuestion = (question) => {
    const keys = Object.keys(question);
    const isValid = keys.every((key) => validQuestionParameters.includes(key));

    if(!isValid){
        return {
            status: false,
            error: 'Invalid parametes!'
        };
    }

    if(!question.url){
        return {
            status: false,
            error: 'Question url missing'
        };
    }

    if(!question.name){
        return {
            status: false,
            error: 'Question name missing'
        };
    }

    if(!question.difficulty){
        return {
            status: false,
            error: 'Difficulty missing'
        }
    }

    return {
        status: true
    };
};

const isValidUpdate = (question) => {
    const keys = Object.keys(question);
    const isValid = keys.every((key) => validQuestionParameters.includes(key));

    if(!isValid){
        return {
            status: false,
            error: 'Invalid parametes!'
        };
    }   

    return {
        status: true
    }
}


const getUserQuestionFromDB = async (questionId, user) => {
    if(!questionId){
        throw new ClientError('Question id missing');
    }

    if(!isUUID(questionId, [4])){
        throw new ClientError('Invalid question id');
    }

    const question = await Question.findByPk(questionId);

    if(!question){
        throw new ClientError('Question not found');
    }

    if(question.UserId !== user.id){
        throw new ClientError('Question not found');
    }

    return question;
}

module.exports.getUserQuestionFromDB = getUserQuestionFromDB;

module.exports.updateQuestion = async (user, questionId, updates) => {
    if(!questionId){
        throw new ClientError('Question id missing');
    }

    if(!updates){
        throw new ClientError('Updates missing');
    }
    
    const {status, error} = isValidUpdate(updates);
        
    if(!status){
        throw new ClientError(error);
    }

    const question = await getUserQuestionFromDB(questionId, user);

    for (const [key, value] of Object.entries(updates)) {
        question[key] = value;    
    }

    await question.save();
    return question;
}

module.exports.getQuestionFromDB = async (questionId) => {    
    if(!questionId){
        throw new ClientError('Question id missing');
    }

    if(!isUUID(questionId, [4])){
        throw new ClientError('Incorrect question id');
    }

    return Question.findByPkWithTags(questionId);
}

/**
 * TODO: Complete below function
 */

module.exports.getUserQuestions = async (user, limit) => {

}