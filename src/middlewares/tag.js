/**
 * Middlewares related to tagging
 */

const Tag = require('../models/Tag');
const {getQuestionFromDB} = require('../utils/question');

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
        const question = await getQuestionFromDB(questionId, user);
        const tagIds = await Tag.getTagIds(tags);
        await question.addTags(tagIds);

        return res.json({
            status: true,
            message: "Tags added successfully"
        });

    } catch(e){
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

/**
 * Delete tags with tag ids 
 */
module.exports.DeleteQuestionTag = async(req, res) => {
    const { questionId, tagIds } = req.body;
    const { user } = req;

    if(!tagIds){
        return res.status(400).json({
            status: false,
            error: 'Tag ids missing'
        });
    }

    try{
        const question = await getQuestionFromDB(questionId, user);
        await question.removeTags(tagIds);

        return res.json({
            status: true,
            message: "Tags deleted successfully"
        });

    } catch(e){
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