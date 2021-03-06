const Question = require('../models/Question');
const Tag = require('../models/Tag');
const { isUUID } = require('validator');
const { ClientError } = require('./errorHandler');
const validQuestionParameters = ['url', 'name', 'notes', 'tags', 'difficulty', 'description', 'visibility'];
const validQuestionUpdateParameters = ['url', 'name', 'notes', 'addTagNames', 'removeTagIds', 'difficulty', 'description', 'visibility'];
const validVisibilities = ['me', 'friends', 'global', 'specific'];

module.exports.createResponseQuestionObject = (question, isEditable) => {
    return {
        id: question.id,
        url: question.url,
        name: question.name, 
        notes: question.notes,
        difficulty: question.difficulty,
        visibility: question.visibility,
        isEditable,
        tags: question.Tags,
        description: question.description
    };
}

const isValidQuestion = (question) => {
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

    if(!question.description){
        return {
            status: false,
            error: 'Description missing'
        };
    }

    if(!question.visibility){
        return {
            status: false,
            error: 'Visibility missing'
        }
    }

    const isValidVisibility = validVisibilities.includes(question.visibility);
    if(!isValidVisibility){
        return {
            status: false,
            error: 'Invalid visibility'
        };
    }

    return {
        status: true
    };
};

const isValidUpdate = (question) => {
    const keys = Object.keys(question);
    const isValid = keys.every((key) => validQuestionUpdateParameters.includes(key));

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

module.exports.addQuestion = async (userId, question) => {
    const {status, error} = isValidQuestion(question);

    if(!status){
        throw new ClientError(error);
    }

    return Question.addQuestion(userId, question);
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

const handleTagUpdates = async (question, {addTagNames, removeTagIds}) => {
    if(addTagNames){
        const tagIds =  await Tag.getTagIds(addTagNames);
        await question.addTags(tagIds);
    }

    if(removeTagIds){
        await question.removeTags(removeTagIds);
    }
} 

// Return entire question along with tags
const getQuestionFromDB = async (questionId) => {    
    if(!questionId){
        throw new ClientError('Question id missing');
    }

    if(!isUUID(questionId, [4])){
        throw new ClientError('Incorrect question id');
    }

    return Question.findByPkWithTags(questionId);
}

module.exports.getQuestionFromDB = getQuestionFromDB;

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

    await handleTagUpdates(question, updates);
    await question.save();
    return getQuestionFromDB(questionId);
}



module.exports.getUserQuestions = async (user, offset, limit) => {
    return user.findQuestions(offset, limit);
}

module.exports.getSearchedAndTaggedQuestions = async (user, prefixText, tags, offset, limit) => {
    return user.findQuestionsByTextAndTags(prefixText, tags, offset, limit);
}

module.exports.getSearchedQuestions = async (user, prefixText, offset, limit) => {
    return user.findQuestionsByText(prefixText, offset, limit);
}