const sequelize = require('../config/db');
const {DataTypes: types, QueryTypes, Op} = require("sequelize");

const Tag = sequelize.define('Tag', {
    id: {
        type: types.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: types.STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
});

/**
 * Add tag to database using this method
 */
Tag.addTag = async (tag) => {
    const alreadyTag = await Tag.findOne({
        where: {
            name: tag
        }
    });

    if(alreadyTag){
        throw ({
            status: 400, 
            error: 'Tag already exist'
        });
    }

    const dbTag = await Tag.create({
        name: tag
    });

    return dbTag;
}

/**
 * Get tag ids from tag names. 
 * WARNING: It creates tags when tag not found!!!
 */

Tag.getTagIds = async (tags) => {
    if(!tags) return [];

    const tagIds = [];
    for(var i =0 ; i < tags.length; i++){
        const tagId = await Tag.findOne({
            attributes: [
                'id'
            ],

            where: {
                name: tags[i]
            }
        });

        if(tagId) tagIds.push(tagId.id);
        else{
            try{
                const currentTag = await Tag.addTag(tags[i]);
                tagIds.push(currentTag.id);
            }
            catch(e){
                console.log(e);
            }
        }
    }

    return tagIds;
}

/**
 * TODO: Change it to only include ids
 */

Tag.getTaggedQuestions = async (tags = [], user) => {
    if(tags.length === 0) return [];

    const questions = await sequelize.query(`SELECT DISTINCT q.id, q.url, q.name\
 FROM "TagMaps" AS tm, "Tags" AS t, "Questions" AS q\
 WHERE tm."QuestionId" = q.id\
 AND t.name IN (:tags)\
 AND tm."TagId" = t.id AND q."UserId" = :UserId;`, {
        replacements:  {tags: tags, UserId: user.id},
        type: QueryTypes.SELECT
    });
  
    return questions;
}

Tag.getSearchTags = async (searchText, limit = 5) => {
    if(!searchText){
        throw{
            status: false,
            error: 'Search text missing'
        }
    }

    const tags = await Tag.findAll({
        where:{
            name: {
                [Op.like] : '%' + searchText + '%'
            }
        }, 
        limit
    });

    return tags;
}

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

module.exports = Tag;