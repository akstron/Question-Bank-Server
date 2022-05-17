const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const User = require('./User');

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

module.exports = FriendMap;