/**
 * Middlewares related to tagging
 */

const Tag = require('../models/Tag');

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