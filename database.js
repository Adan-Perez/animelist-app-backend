const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'animeDB.sqlite',
});

module.exports = sequelize;
