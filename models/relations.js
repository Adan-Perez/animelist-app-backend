const AnimelistModel = require('./AnimelistModel');
const AnimeModel = require('./AnimeModel');
const ChapterModel = require('./ChapterModel');

const defineRelations = (AnimelistModel, AnimeModel, ChapterModel) => {
  AnimelistModel.hasMany(AnimeModel, {
    foreignKey: 'animelist_id',
    onDelete: 'cascade',
  });
  AnimeModel.belongsTo(AnimelistModel, { foreignKey: 'animelist_id' });

  AnimeModel.hasMany(ChapterModel, {
    foreignKey: 'anime_mal_id',
    onDelete: 'cascade',
  });
  ChapterModel.belongsTo(AnimeModel, { foreignKey: 'anime_mal_id' });
};

module.exports = defineRelations;
