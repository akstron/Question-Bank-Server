const { Sequelize } = require('sequelize');

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

sequelize.authenticate().then(() => {
    console.log('Connected successfully!');
}).catch((e) => {
    console.log('error:', e);
});

module.exports = sequelize;