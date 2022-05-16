const sequelize = require('../config/db');
const {DataTypes: types, Sequelize} = require("sequelize");
const User = require('./User');

const Notification = sequelize.define('Notification', {
    id: {
        type: types.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
  
    title: {
        type: types.STRING(100),
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    }, 

    type: {
        type: types.STRING(30),
        allowNull: false,
    }, 

    content: {
        type: types.TEXT,
    }
}, {
    timestamps: true
});

Notification.addNotification = async (UserId, NotificationObj) => {
    const notification = await Notification.create({
        ...NotificationObj,
        UserId
    });

    return notification;
}

User.hasMany(Notification, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },

    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Notification.belongsTo(User, {
    foreignKey: {
        type: types.UUID,
        allowNull: false,
    },

    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

module.exports = Notification;