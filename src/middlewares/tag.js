/**
 * Middlewares related to tagging
 */

const Tag = require('../models/Tag');
const Question = require('../models/Question');

const isValidUUID = (uuid) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
}

const checkQuestionValidiy = async (questionId, user) => {
    if(!questionId){
        return {
            status: false,
            error: 'Question id missing'
        }
    }

    if(!isValidUUID(questionId)){
        return {
            status: false,
            error: 'Invalid question id'
        };
    }

    const question = await Question.findByPk(questionId);

    if(!question){
        return {
            status: false,
            error: 'Question not found!'
        };
    }

    if(question.UserId !== user.id){
        return {
            status: false,
            error: 'Question not found!!'
        };
    }

    return {
        status: true,
        question
    };
}

module.exports.AddQuestionTag = async (req, res) => {
    const { user } = req;
    const { questionId, tags } = req.body;

    if(!tags){
        return res.status(400).json({
            status: false,
            error: 'Tags missing'
        });
    }

    try{
        const {status, question, error} = await checkQuestionValidiy(questionId, user);
        
        if(!status){
            return res.status(400).json({
                status,
                error
            });
        }

        const tagIds = await Tag.getTagIds(tags);
        await question.addTags(tagIds);

        return res.json({
            status: true,
            message: "Tags added successfully"
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            status: false,
            error: "Something went wrong"
        });
    }
}

/**
 * Delete tags with tag ids 
 */
module.exports.DeleteQuestionTag = async(req, res) => {
    const { tagIds } = req.body;

    if(!tagIds){
        return res.status(400).json({
            status: false,
            error: 'Tag ids missing'
        });
    }

    try{
        const {status, question, error} = await checkQuestionValidiy(questionId, user);
        
        if(!status){
            return res.status(400).json({
                status,
                error
            });
        }

    } catch(e){
        console.log(e);
        return res.status(500).json({
            status: false,
            error: "Something went wrong!"
        });
    }
}

/**
 * Add tags with tag names
 */
module.exports.AddTag = async (req, res) => {
    const { tag } = req.body;
    
    if(!tag){
        return res.status(400).json({
            status: false,
            error: 'No tag provided'
        });
    }

    try{
        await Tag.addTag(tag);
        
        return res.json({
            status: true,
            message: 'Tag added successfully'
        });
    }
    catch(e){
        console.log(e);
        return res.status(e.status || 500).json({
            status: false, 
            error: e.error || 'Something went wrong'
        });
    }
}