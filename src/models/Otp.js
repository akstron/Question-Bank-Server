const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");
const User = require('./User');

const Otp = sequelize.define('Otp', {
    otp : {
        type: types.INTEGER,
        allowNull: false,
    }, 

    UserId: {
        type: types.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
    }
}, {
    timestamps: false
});

Otp.belongsTo(User, {
    foreignKey: {
        type: types.UUID,
        allowNull: false
    },
    
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
});

User.hasOne(Otp, {
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
});

module.exports = Otp;