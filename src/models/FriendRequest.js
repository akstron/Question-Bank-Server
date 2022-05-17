const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const User = require('./User');

const FriendRequest = sequelize.define('FriendRequest', {
    From: {
        type: types.UUID,
        allowNull: false,
        references: {
            model: User, 
            key: 'id'
        }, 
        primaryKey: true
    },

    To: {
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

module.exports = FriendRequest;