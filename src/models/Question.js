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

    description: {
        type: types.STRING(30),
        allowNull: false,
    },

    notes: {
        type: types.TEXT,
    },  

    difficulty: {
        type: types.INTEGER, 
        allowNull: false,
    }
}, {
    timestamps: true
});

Question.addQuestion = async (UserId, questionObj) => {
    const question = await Question.create({
        ...questionObj,
        UserId
    });

    const tags = questionObj.tags;
    const tagIds = await Tag.getTagIds(tags);

    await question.addTags(tagIds);

    return question;
}

Question.findByPkWithTags = async (questionId) => {
    return Question.findByPk(questionId, {
        attributes: [
            'url', 'name', 'notes', 'UserId', 'difficulty', 'id', 'description'
        ],
        include: [{
                model: Tag,
                attributes: ['id', 'name'],
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