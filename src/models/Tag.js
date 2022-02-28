const sequelize = require('../config/db');
const {DataTypes: types, QueryTypes} = require("sequelize");

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
});

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
 * TODO: Change it to only include ids
 */

Tag.getTaggedQuestions = async (tags = []) => {
    if(tags.length === 0) return [];

    const questions = await sequelize.query(`SELECT DISTINCT q.id, q.url, q.name, q.notes\
 FROM "TagMaps" AS tm, "Tags" AS t, "Questions" AS q\
 WHERE tm."QuestionId" = q.id\
 AND t.name IN (:tags)\
 AND tm."TagId" = t.id;`, {
        replacements:  {tags: tags},
        type: QueryTypes.SELECT
    });
  
    return questions;
}

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

module.exports = Tag;