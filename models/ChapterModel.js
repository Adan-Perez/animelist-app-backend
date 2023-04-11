const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ChapterModel = sequelize.define('ChapterModel', {
  // PK
  chapter_mal_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // FK
  anime_mal_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'animemodels',
      key: 'mal_id',
    },
    allowNull: false,
  },
});

module.exports = ChapterModel;
