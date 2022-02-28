const Question = require('../models/Question');
const validQuestionParameters = ['url', 'name', 'notes', 'tags'];

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

    return {
        status: true
    };
};

module.exports.isValidUpdate = (question) => {
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

const isValidUUID = (uuid) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
}


module.exports.getQuestionFromDB = async (questionId, user) => {
    if(!questionId){
        throw {
            status: false,
            error: 'Question id missing'
        }
    }

    if(!isValidUUID(questionId)){
        throw {
            status: false,
            error: 'Invalid question id'
        };
    }

    const question = await Question.findByPk(questionId);

    if(!question){
        throw {
            status: false,
            error: 'Question not found!'
        };
    }

    if(question.UserId !== user.id){
        throw {
            status: false,
            error: 'Question not found!!'
        };
    }

    return question;
}
