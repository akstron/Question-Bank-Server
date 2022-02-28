const { Sequelize } = require('sequelize');
/*
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
*/

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

sequelize.authenticate().then(() => {
    console.log('Connected successfully!');
}).catch((e) => {
    console.log('error:', e);
});

module.exports = sequelize;