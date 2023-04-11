const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const AnimelistModel = sequelize.define('AnimelistModel', {
  animelist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = AnimelistModel;
