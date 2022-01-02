
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