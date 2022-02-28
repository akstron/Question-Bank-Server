/**
 * Middlewares related to questions
 */

const Question = require('../models/Question');
const Tag = require('../models/Tag');
const {isValidQuestion, isValidUpdate, getQuestionFromDB} = require('../utils/question');

Question.sync().then(() => {
    console.log("Question sync successfull");
}).catch((e) => console.log(e));


module.exports.AddQuestion = async (req, res) => {
    try{
        const {status, error} = isValidQuestion(req.body);

        if(!status){
            return res.status(400).json({
                status,
                error
            });
        }

        const question = await Question.addQuestion(req.user.id, req.body);

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
        const { user } = req;
        const { questionId } = req.body;
        const question = await getQuestionFromDB(questionId, user);

        await question.destroy();

        return res.json({
            status: true,
            message: "Question removed successfully"
        });
    }
    catch(e){
        console.log(e);
        if(!e.error){
            return res.status(500).json({
                status: false,
                error: 'Something went wrong'
            })
        }

        return res.status(400).json({
            status: false,
            error: e.error
        })
    }
}

module.exports.UpdateQuestion = async (req, res) => {
    try{
        const { user } = req;
        const {questionId, updates} = req.body;

        if(!questionId){
            return res.status(400).json({
                status: false,
                error: 'Provide question id'
            });
        }

        if(!updates){
            return res.status(400).json({
                status: false,
                error: 'Updates missing'
            });
        }

        const {status, error} = isValidUpdate(updates);
        
        if(!status){
            return res.status(400).json({
                status, 
                error
            })
        }

        const question = await getQuestionFromDB(questionId, user);

        for (const [key, value] of Object.entries(updates)) {
            question[key] = value;    
        }

        await question.save();

        return res.json({
            status: true,
            message: "Question updated"
        });
    }
    catch(e){
        console.log(e);
        if(!e.error){
            return res.status(500).json({
                status: false,
                error: 'Something went wrong'
            })
        }

        return res.status(400).json({
            status: false,
            error: e.error
        })
    }
}

module.exports.GetQuestionDetails = async (req, res) => {
    const { questionId } = req.body;

    if(!questionId){
        return res.status(400).json({
            status: false,
            error: 'Provide question id'
        });
    }

    try{
        const question = await Question.findByPk(questionId, {
            attributes: [
                'url', 'name', 'notes'
            ],
            include: [{
                    model: Tag,
                    attributes: ['name'],
                    through: {
                        /* 
                            For removing junction object
                            https://sequelize.org/master/manual/eager-loading.html
                        */
                        attributes: []
                    }
                }
            ]
        });

        const questionObj = {
            url: question.url,
            name: question.name, 
            notes: question.notes,
            tags: []
        };

        question.Tags.forEach((tag) => {
            questionObj.tags.push(tag.name);
        });


        return res.json({
            status: true,
            question: questionObj
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

module.exports.GetTaggedQuestions = async (req, res) => {
    const { tags } = req.body;
    try{
        const questions = await Tag.getTaggedQuestions(tags);

        console.log(questions);

        return res.json({
            status: true,
            questions
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            status: false,
            error: 'Something went wrong'
        });
    }
}