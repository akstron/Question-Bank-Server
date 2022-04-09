const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');
const {DataTypes: types, QueryTypes} = require("sequelize");
const Question = require('./Question');
const Tag = require('./Tag');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: types.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    username: {
        type: types.STRING(50),
        allowNull: false,
        unique: true
    },
    fullName: {
        type: types.STRING(50),
        allowNull: false
    },
    bio: {
        type: types.STRING(50)
    },
    email: {
        type: types.STRING(50), 
        allowNull: false, 
        unique: true
    }, 
    password: {
        type: types.STRING(70),
        allowNull: false,
        set(password){
            this.setDataValue('password', bcrypt.hashSync(password, 8));
        }
    }
}, {
    timestamps: false
});

User.register = async (userFields) => {
    const user = await User.create({
        ...userFields
    })

    console.log(user);

    return user;
}

User.findByEmail = async (email) => {
    return User.findOne({
        where: {
            email
        }
    });
}

User.findByUsername = async (username) => {
    return User.findOne({
        where: {
            username
        }
    });
}

User.prototype.findTagStats = async function(offset = 0, limit = 5) {
    const user = this;
    const stats = await sequelize.query(`select count(q.id) as "count", \
t."TagId" as "tagId", t2.name as "TagName" from "Users" as u \
INNER JOIN "Questions" as q ON u.id = q."UserId" \
INNER JOIN "TagMaps" as t ON q.id = t."QuestionId" \
INNER JOIN "Tags" as t2 ON t."TagId" = t2.id \
where u.id = :UserId \
GROUP BY t."TagId", t2.name \
ORDER BY t2."name" LIMIT :limit OFFSET :offset;`, {
        replacements:  {limit: limit, UserId: user.id, offset: offset},
        type: QueryTypes.SELECT
    });

    console.log(stats);

    return stats;
}

User.prototype.findDifficultyStats = async function(offset = 0, limit = 5) {
    const user = this;
    const stats = await sequelize.query(`select difficulty, count(difficulty) \
as "count" from "Questions" as q where q."UserId" = :UserId GROUP BY difficulty \
ORDER BY difficulty LIMIT :limit OFFSET :offset;`, {
        replacements:  {limit: limit, UserId: user.id, offset: offset},
        type: QueryTypes.SELECT
    });

    return stats;
}

User.prototype.getQuestions = async function(offset = 0, limit = 5) {
    const user = this;
    console.log(offset);

    return Question.findAll({
        attributes: [
            'id', 'url', 'name', 'difficulty', 'description'
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
        ], 
        where: {
            UserId : user.id
        },
        offset,
        limit
    });
}

/**
 * Moved from 'Question' to 'User' to remove circular dependency
 * https://stackoverflow.com/questions/47538043/sequelize-typeerror-user-hasmany-is-not-a-function
 */
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

User.sync().then(() => console.log('User sync successfull'))
.catch(e => console.log(e));

module.exports = User;