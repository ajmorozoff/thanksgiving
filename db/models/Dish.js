const Sequelize = require('sequelize');
const { db } = require('../connection');

const Dish = db.define('dish', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: {
        type: Sequelize.STRING,
    }
});

module.exports = { Dish };
