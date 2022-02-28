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

Tag.getTaggedQuestions = async (tags) => {
    const questions = await sequelize.query('SELECT "q.id", "q.url", "q.name", "q.notes"\
 FROM "TagMaps" tm, "Tags" t, "Questions" q\
 WHERE "tm.QuestionId" = "t.id"\
 AND ("t.name" IN (:tags)\
 AND "tm.TagId" = "q.id"', {
        replacements:  {tags},
        type: QueryTypes.SELECT
    });

    // const questions = await sequelize.query('SELECT * FROM "Tags"', {
    //     replacements: ["Tags"],
    //     type: QueryTypes.SELECT
    // });

    // console.log(questions);
    return questions;
}

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

module.exports = Tag;