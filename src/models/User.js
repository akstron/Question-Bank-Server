const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');
const {DataTypes: types} = require("sequelize");
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: types.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
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
});

User.register = async (email, password) => {
    const user = await User.create({
        email, 
        password
    })

    console.log(user);

    return user.id;
}

User.sync().then(() => console.log('User sync successfull'))
.catch(e => console.log(e));

module.exports = User;