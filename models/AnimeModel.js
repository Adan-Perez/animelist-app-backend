const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AnimeModel = sequelize.define('AnimeModel', {
  // PK
  mal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  episodes: {
    type: DataTypes.INTEGER, 
  },
  type: {
    type: DataTypes.STRING,
  },
  trailer_url: {
    type: DataTypes.STRING,
  },
  // FK
  animelist_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'animelistmodels',
      key: 'animelist_id',
    },
    allowNull: false,
  },
});

module.exports = AnimeModel;
