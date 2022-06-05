const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const User = require('./User');
// console.log("FriendMap.js: ", User);

/**
 * create table "FriendMaps"("UserId1" UUID NOT NULL references "Users"(id), "UserId2" UUID NOT NULL references "Users"(id));
 */

const FriendMap = sequelize.define('FriendMap', {
    UserId1: {
        type: types.UUID,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }, 
        primaryKey: true
    },

    UserId2: {
        type: types.UUID,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }, 
        primaryKey: true
    }
}, {
    timestamps: false
});


/**
 * TODO: Optimize this using query
 */

 FriendMap.isFriend = async (userId1, userId2) => {
    let result = await FriendMap.findOne({
        where: {
            UserId1: userId1,
            UserId2: userId2
        }
    });

    if(result){
        return true;
    }

    result = await FriendMap.findOne({
        where: {
            UserId1: userId2, 
            UserId2: userId1
        }
    });

    return (result ? true: false);
}

module.exports = FriendMap;