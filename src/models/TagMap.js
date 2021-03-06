const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const Tag = require('./Tag');
const Question = require('./Question');

const TagMap = sequelize.define('TagMap', {
    TagId: {
        type: types.INTEGER,
        allowNull: false,
        references: {
            model: Tag,
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

Tag.belongsToMany(Question, {
    through: TagMap
});

Question.belongsToMany(Tag, {
    through: TagMap
});

module.exports = TagMap;