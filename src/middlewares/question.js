/**
 * Middlewares related to questions
 */
const Tag = require('../models/Tag');
const User = require('../models/User');
const {addQuestion, getUserQuestionFromDB, getQuestionFromDB, updateQuestion, getUserQuestions, getSearchedAndTaggedQuestions, getSearchedQuestions} = require('../utils/question');
const { handleError, ClientError } = require('../utils/errorHandler');
const { addShareQuestionNotification } = require('../utils/notification');

module.exports.AddQuestion = async (req, res) => {
    try{
        const question = await addQuestion(req.user.id, req.body);

        return res.json({
            questionId: question.id,
            status: true, 
            message: 'Question added successfully!'
        });
    }   
    catch(e){
        handleError(e, res);
    }
}

module.exports.GetQuestions = async (req, res) => {
    try{
        const {offset, limit} = req.query;
        const questions = await getUserQuestions(req.user, offset, limit);

        return res.json({
            status: true,
            questions
        });
    }
    catch(e){
        return handleError(e, res);
    }
}

module.exports.DeleteQuestion = async (req, res) => {
    try{
        const { user } = req;
        const { questionId } = req.body;

        const question = await getUserQuestionFromDB(questionId, user);
        await question.destroy();

        return res.json({
            status: true,
            message: "Question deleted successfully"
        });
    }
    catch(e){
        handleError(e, res);
    }
}

module.exports.UpdateQuestion = async (req, res) => {
    try{
        const { user } = req;
        const {questionId, updates} = req.body;
        
        const question = await updateQuestion(user, questionId, updates);

        return res.json({
            status: true,
            message: "Question updated",
            question
        });
    }
    catch(e){
        handleError(e, res);
    }
}

module.exports.GetQuestion = async (req, res) => {
    const { id } = req.query;
    const { user } = req;

    try{
        const question = await getQuestionFromDB(id);
        if(!question){
            return res.status(400).json({
                status: false,
                error: 'Question not found!'
            });
        }

        if(user.id !== question.UserId){
            const isAccessAvailable = await user.hasQuestionAccess(questionId); 
            if(!isAccessAvailable){
                return res.status(400).json({
                    status: false,
                    error: 'Question not found!!'
                });
            }
        }

        const questionObj = {
            id: question.id,
            url: question.url,
            name: question.name, 
            notes: question.notes,
            difficulty: question.difficulty,
            isEditable: (user.id === question.UserId),
            tags: question.Tags,
            description: question.description
        };

        return res.json({
            status: true,
            question: questionObj
        });
    }

    catch(e){
        handleError(e, res);
    }
}

module.exports.GetTaggedQuestions = async (req, res) => {
    try{
        var tags;
        try{
            tags = JSON.parse(req.query.tags);
        }
        catch(e){
            console.log(e);
            return res.status(400).json({
                status: false,
                error: 'Incorrect query string'
            });
        }

        if(!Array.isArray(tags)){
            throw { 
                status: false,
                error: 'Tags should be an array'
            };
        }

        const questions = await Tag.getTaggedQuestions(tags, req.user);

        return res.json({
            status: true,
            questions
        });
    }
    catch(e){
        handleError(e, res);
    }
}

module.exports.ShareQuestion = async (req, res) => {
    const { email, questionId } = req.body;
    if(!email){
        return res.status(400).json({
            status: false,
            error: 'Email missing'
        });
    }

    if(!questionId){
        return res.status(400).json({
            status: false,
            error: 'Question id missing'
        });
    }

    try{
        const user = await User.findByEmail(email);

        if(!user){
            return res.status(400).json({
                status: false,
                error: 'User not found!'
            });
        }

        const question = await getUserQuestionFromDB(questionId, req.user);

        /* If question is already shared don't share it again!*/
        if(question.hasUserAccess(user.id)){
            return res.json({
                status: true,
                message: 'Question already shared'
            });
        }

        await question.addUserAccess(user.id);
        await addShareQuestionNotification(req.user, user, question);

        return res.json({
            status: true,
            message: 'Shared'
        });

    } catch(e){
        handleError(e, res);
    }
}

module.exports.UnshareQuestion = async (req, res) => {
    const { email, questionId } = req.body;
    if(!email){
        return res.status(400).json({
            status: false,
            error: 'Email missing'
        });
    }

    if(!questionId){
        return res.status(400).json({
            status: false,
            error: 'Question id missing'
        });
    }

    try{
        const user = await User.findOne({
            where: {
                email
            }
        });

        if(!user){
            return res.status(400).json({
                status: false,
                error: 'User not found!'
            });
        }

        const question = await getUserQuestionFromDB(questionId, req.user);
        await question.removeUserAccess(user.id);

        return res.json({
            status: true,
            message: 'Unshared'
        });

    } catch(e){
        handleError(e, res);
    }
}

module.exports.GetSearchedAndTaggedQuestions = async (req, res) => {
    try{
        var tags;
        try{
            tags = JSON.parse(req.query.tags);
        }
        catch(e){
            throw new ClientError('Incorrect tags');
        }

        if(!Array.isArray(tags)){
            throw new ClientError('tags should be an array');
        }

        const {prefixText, limit, offset} = req.query;
        const questions = await getSearchedAndTaggedQuestions(req.user, prefixText, tags, offset, limit);
        return res.json({
            status: true,
            questions
        })
    } 
    catch (e) {
        return handleError(e, res);
    }
}

module.exports.GetSearchedQuestions = async (req, res) => {
    try{
        const {prefixText, limit, offset} = req.query;
        const questions = await getSearchedQuestions(req.user, prefixText, offset, limit);
        return res.json({
            status: true,
            questions
        })
    } catch(e){
        return handleError(e, res);
    }
}