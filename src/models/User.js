const sequelize = require('../config/db');
const { Sequelize, HostNotFoundError } = require('sequelize');
const {DataTypes: types, QueryTypes} = require("sequelize");
const Question = require('./Question');
const Tag = require('./Tag');
const bcrypt = require('bcryptjs');
const FriendRequest = require('./FriendRequest');
const FriendMap = require('./FriendMap');

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

/**
 * First INNER JOIN needs to be removed
 */

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

User.prototype.findQuestions = async function(offset = 0, limit = 5) {
    const user = this;

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

User.prototype.findQuestionsByTextAndTags = async function(prefixText, tags, offset = 0, limit = 5) {
    const user = this;

    prefixText += '%';
    console.log(tags);

return sequelize.query(`select q.id, q.url, q.name, q.difficulty, q.description, \
to_json(array_agg(json_build_object('id', t2.id, 'name', t2.name))) as "Tags" from "Questions" \
as q INNER JOIN "TagMaps" as t1 \
ON q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
where "UserId" = :UserId AND EXISTS (SELECT DISTINCT q.id FROM "Questions" \
INNER JOIN "TagMaps" as t1 on q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
WHERE "UserId" = :UserId AND t2.name IN (:tags)) AND q.name LIKE :prefixText GROUP BY q.id, \
q.url, q.difficulty, q.description LIMIT :limit OFFSET :offset;`, {
    replacements:  {limit, UserId: user.id, offset: offset, tags, prefixText},
    type: QueryTypes.SELECT
});
}

User.prototype.findQuestionsByText = async function(prefixText, offset = 0, limit = 5){
    const user = this;

    prefixText += '%';

    return sequelize.query(`select q.id, q.url, q.name, q.difficulty, q.description, \
to_json(array_agg(json_build_object('id', t2.id, 'name', t2.name))) as "Tags" \
from "Questions" as q INNER JOIN "TagMaps" as t1 \
ON q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
where "UserId" = :UserId AND EXISTS (SELECT DISTINCT q.id FROM "Questions" \
INNER JOIN "TagMaps" as t1 on q.id = t1."QuestionId" INNER JOIN "Tags" as t2 on t1."TagId" = t2.id \
WHERE "UserId" = :UserId) AND q.name LIKE :prefixText GROUP BY q.id, \
q.url, q.difficulty, q.description LIMIT :limit OFFSET :offset;`, {
    replacements:  {limit, UserId: user.id, offset: offset, prefixText},
    type: QueryTypes.SELECT
});
}

User.prototype.isFriendRequestSent = async function(toId){
    const user = this;
    const friendRequest = await FriendRequest.findOne({
        where: {
            From: user.id, 
            To: toId
        }
    });

    return (friendRequest ? true : false);
}

User.prototype.addFriendRequest = async function(toId){
    const user = this;
    return FriendRequest.create({
        From: user.id, 
        To: toId
    });
}

User.prototype.removeFriendRequest = async function(fromId){
    const user = this;
    return FriendRequest.destroy({
        where: {
            From: fromId, 
            To: user.id
        }
    });
}

User.prototype.addFriend = async function(friendId){
    const user = this;
    return FriendMap.create({
        UserId1: user.id,
        UserId2: friendId
    });
}

User.prototype.findFriends = async function(prefixFullName = '', prefixUsername = '', prefixEmail = '', offset = 0, limit = 5){
    const user = this;
    prefixFullName += '%';
    prefixUsername += '%';
    prefixEmail += '%';

    return sequelize.query(`SELECT id, username, "fullName", bio, email from "Users" AS u WHERE u.id IN \
(SELECT "UserId1" AS friendId from "FriendMaps" WHERE "UserId2" = :id \
UNION SELECT "UserId2" AS friendId from "FriendMaps" WHERE "UserId1" = :id) \
AND u.email LIKE :prefixEmail AND u.username LIKE :prefixUsername AND \
u."fullName" LIKE :prefixFullName LIMIT :limit OFFSET :offset;`, {
        replacements:  {limit, id: user.id, offset: offset, prefixFullName, prefixEmail, prefixUsername},
        type: QueryTypes.SELECT
    });
}

/**
 * Moved from 'Question' to 'User' to remove circular dependency
 * https://stackoverflow.com/questions/47538043/sequelize-typeerror-user-hasmany-is-not-a-function
 */
 Question.belongsTo(User, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },
});

User.hasMany(Question, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },

    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
    hooks: true
});

module.exports = User;