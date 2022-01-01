/**
 * Middlewares related to questions
 */

const { createSchema } = require('../config/db');
const Question = require('../models/Question');

/**
 * TODO: Handle empty objects
 */

Question.sync().then(() => {
    console.log("Question sync successfull");
}).catch((e) => console.log(e));

module.exports.AddQuestion = async (req, res) => {
    try{
        const question = await Question.addQuestion(req.user.id, req.body);
        console.log('Question hai ye: ', question);

        return res.json({
            questionId: question.id,
            status: true, 
            message: 'Question added successfully!'
        });
    }   
    catch(e){
        console.log(e);

        return res.status(500).json({
            status: false, 
            error: 'Something went wrong'
        });
    }
}

module.exports.GetQuestions = async (req, res) => {
    try{
        const user = req.user;
        const questions = await user.getQuestions();

        return res.json({
            status: true,
            questions
        });
    }
    catch(e){
        return res.status(500).json({
            status: false,
            error: 'Something went wrong'
        });
    }
}

module.exports.DeleteQuestion = async (req, res) => {
    try{
        const { questionId } = req.body;

        await Question.destroy({
            where: {
                id: questionId 
            }
        })

        return res.json({
            status: true,
            message: "Question removed successfully"
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            status: false,
            error: 'Something went wrong'
        });
    }
}

module.exports.UpdateQuestion = async (req, res) => {
    try{
        /**
         * TODO: CHECK VALID UPDATES
         */

        const {questionId, updates} = req.body;

        await Question.update({...updates}, {
            where: {
                id: questionId
            }
        });

        return res.json({
            status: true,
            message: "Question updated"
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            status: false,
            error: 'Something went wrong'
        });
    }
}