const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const User = require('./User');
const Question = require('./Question');

const QuestionAccess = sequelize.define('QuestionAccess', {
    UserId: {
        type: types.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },

    QuestionId: {
        type: types.UUID,
        allowNull: false,
        references: {
            model: Question, 
            key: 'id'
        }
    }
}, {
    timestamps: false
});

User.belongsToMany(Question, {
    through: QuestionAccess,
    as: {singular: 'Share', plural: 'Shares'}
});

Question.belongsToMany(User, {
    through: QuestionAccess,
    as: {singular: 'UserAccess', plural: 'UserAccesses'}
});

QuestionAccess.sync().then(() => 
console.log('QuestionAccess synced successfully'))
.catch((e) => console.log(e));

module.exports = QuestionAccess;