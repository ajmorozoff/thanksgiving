const Sequelize = require('sequelize');
const { db } = require('../connection');

const Person = db.define('person', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    isAttending: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
    //TODO: Add virtual property "bringingDish" which returns true if there is a dish whose id matches the person's id
});

module.exports = { Person };
