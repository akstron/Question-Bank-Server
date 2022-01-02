const sequelize = require('../config/db');
const {DataTypes: types, Sequelize} = require("sequelize");
const User = require('./User');
const Tag = require('./Tag');

const Question = sequelize.define('Question', {
    id: {
        type: types.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
  
    url: {
        type: types.STRING(100),
        allowNull: false,
        validate: {
            isUrl: true,
            len: [1, 100]
        }
    }, 

    name: {
        type: types.STRING(30),
        allowNull: false,
    }, 

    notes: {
        type: types.TEXT,
    }
});

/**
 * TODO: Complete tagging mechanism
 */

Question.addQuestion = async (UserId, questionObj) => {
    const question = await Question.create({
        ...questionObj,
        UserId
    });

    const tags = questionObj.tags;
    const tagIds = [];
    if(tags){
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
    }

    await question.addTags(tagIds);

    return question;
}

User.hasMany(Question, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },

    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Question.belongsTo(User, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },

    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Question.sync().then(() => {
    console.log('Question sync successfull');
}).catch(e => console.log(e));

module.exports = Question;