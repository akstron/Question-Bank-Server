const sequelize = require('../config/db');
const {DataTypes: types} = require("sequelize");

const Tag = sequelize.define('Tag', {
    id: {
        type: types.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: types.STRING(30),
        allowNull: false,
        unique: true
    }
});

Tag.addTag = async (tag) => {
    const alreadyTag = await Tag.findOne({
        where: {
            name: tag
        }
    });

    if(alreadyTag){
        throw ({
            status: 400, 
            error: 'Tag already exist'
        });
    }

    const dbTag = await Tag.create({
        name: tag
    });

    return dbTag;
}

Tag.sync().then(() => {
    console.log('Tag synced successfully');
}).catch((e) => console.log(e));

module.exports = Tag;