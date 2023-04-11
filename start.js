const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const AnimelistModel = require('./models/AnimelistModel');
const AnimeModel = require('./models/AnimeModel');
const ChapterModel = require('./models/ChapterModel');
const defineRelations = require('./models/relations');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Asociar modelos
defineRelations(AnimelistModel, AnimeModel, ChapterModel);

// Sincronizar los modelos con la base de datos
(async () => {
  await sequelize.sync();
  console.log('Modelos sincronizados con la base de datos');
})();

// Agregar una lista de animes
app.post('/animelists', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'El campo "title" es requerido' });
  }
  try {
    const animelist = await AnimelistModel.create({ title });
    res.status(201).json(animelist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear la lista de animes' });
  }
});

// Agregar un anime a una lista working good
app.post('/animelists/:id/animes', async (req, res) => {
  const { mal_id, title, image, episodes, type, trailer_url } = req.body;
  const animelist_id = req.params.id;

  try {
    const anime = await AnimeModel.create({
      mal_id,
      title,
      image,
      episodes,
      type,
      trailer_url,
      animelist_id: animelist_id,
    });

    res.status(201).json(anime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el anime' });
  }
});

// Obtener todas las listas de animes
app.get('/animelists', async (req, res) => {
  try {
    const animelists = await AnimelistModel.findAll();
    res.status(200).json(animelists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener las listas de animes' });
  }
});

// Obtener todos los animes de una lista
app.get('/animelists/:animelistId/animes', async (req, res) => {
  try {
    const animelist = await AnimelistModel.findByPk(req.params.animelistId);
    if (!animelist) {
      return res.status(404).json({ error: 'La lista de animes no existe' });
    }
    const animes = await AnimeModel.findAll({
      where: {
        animelist_id: req.params.animelistId,
      },
    });
    res.status(200).json(animes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener los animes' });
  }
});

// Obtener un anime de una lista
app.get('/animelists/:id/animes/:mal_id', async (req, res) => {
  try {
    const anime = await AnimeModel.findOne({
      where: {
        mal_id: req.params.mal_id,
        animelist_id: req.params.id,
      },
    });
    res.status(200).json(anime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener el anime' });
  }
});

// Editar el titulo de una lista de animes
app.put('/animelists/:animelistId', async (req, res) => {
  const { animelistId } = req.params;
  const { title } = req.body;
  console.log(animelistId);
  try {
    const animelist = await AnimelistModel.findByPk(animelistId);
    if (!animelist) {
      return res.status(404).json({ error: 'La lista de animes no existe' });
    }
    await animelist.update({ title });
    res.status(200).json(animelist);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'No se pudo editar el titulo de la lista de animes' });
  }
});

// Eliminar una lista de animes
app.delete('/animelists/:animelistId', async (req, res) => {
  const { animelistId } = req.params;
  try {
    console.log(`Buscando lista de animes con id ${animelistId}`);
    const animelist = await AnimelistModel.findByPk(animelistId);
    if (!animelist) {
      return res.status(404).json({ error: 'La lista de animes no existe' });
    }
    console.log(`Eliminando lista de animes con id ${animelistId}`);
    await animelist.destroy();
    console.log(`Lista de animes con id ${animelistId} eliminada`);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar la lista de animes' });
  }
});

// Eliminar un anime de una lista de animes
app.delete('/animelists/:animelistId/animes/:mal_id', async (req, res) => {
  const { animelistId, mal_id } = req.params;
  try {
    console.log(`Buscando anime con id ${mal_id}`);
    const anime = await AnimeModel.findOne({
      where: {
        mal_id: mal_id,
        animelist_id: animelistId,
      },
    });
    if (!anime) {
      return res.status(404).json({ error: 'El anime no existe' });
    }
    console.log(`Eliminando anime con id ${mal_id}`);
    await anime.destroy();
    console.log(`Anime con id ${mal_id} eliminado`);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar el anime' });
  }
});

// Editar un anime de una lista de animes
app.put('/animelists/:animelistId/animes/:mal_id', async (req, res) => {
  const { animelistId, mal_id } = req.params;
  const { title, image, episodes, type } = req.body;
  try {
    const anime = await AnimeModel.findOne({
      where: {
        mal_id: mal_id,
        animelist_id: animelistId,
      },
    });
    if (!anime) {
      return res.status(404).json({ error: 'El anime no existe' });
    }
    await anime.update({ title, image, episodes, type });
    res.status(200).json(anime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo editar el anime' });
  }
});

// Agregar un capitulo a un anime
app.post(
  '/animelists/:animelistId/animes/:mal_id/chapters',
  async (req, res) => {
    const { animelistId, mal_id } = req.params;
    const { chapter_mal_id, id_chapter, title, anime_mal_id } = req.body;
    try {
      const anime = await AnimeModel.findOne({
        where: {
          mal_id: mal_id,
          animelist_id: animelistId,
        },
      });
      if (!anime) {
        return res.status(404).json({ error: 'El anime no existe' });
      }
      const chapter = await ChapterModel.create({
        chapter_mal_id: chapter_mal_id,
        id_chapter,
        title,
        anime_mal_id: anime_mal_id,
      });
      res.status(201).json(chapter);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'No se pudo agregar el capitulo' });
    }
  }
);

// Obtener todos los capitulos de un anime
app.get(
  '/animelists/:animelistId/animes/:mal_id/chapters',
  async (req, res) => {
    const { animelistId, mal_id } = req.params;
    try {
      const anime = await AnimeModel.findOne({
        where: {
          mal_id: mal_id,
          animelist_id: animelistId,
        },
      });
      if (!anime) {
        return res.status(404).json({ error: 'El anime no existe' });
      }
      const chapters = await ChapterModel.findAll({
        where: {
          anime_mal_id: mal_id,
        },
      });
      res.status(200).json(chapters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'No se pudo obtener los capitulos' });
    }
  }
);

// Eliminar un capitulo de un anime
app.delete(
  '/animelists/:animelistId/animes/:mal_id/chapters/:chapter_mal_id',
  async (req, res) => {
    const { animelistId, mal_id, chapter_mal_id } = req.params;

    try {
      const chapter = await ChapterModel.findOne({
        where: {
          chapter_mal_id: chapter_mal_id,
          anime_mal_id: mal_id,
        },
      });

      if (!chapter) {
        return res.status(404).json({ error: 'El capitulo no existe' });
      }
      console.log(`Eliminando capitulo con id ${chapter_mal_id}`);
      await chapter.destroy();
      console.log(`Capitulo con id ${chapter_mal_id} eliminado`);
      res.status(204).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'No se pudo eliminar el capitulo' });
    }
  }
);

// Eliminar todos los capitulos de un anime
app.delete(
  '/animelists/:animelistId/animes/:mal_id/chapters',
  async (req, res) => {
    const { animelistId, mal_id } = req.params;
    try {
      const chapters = await ChapterModel.findAll({
        where: {
          anime_mal_id: mal_id,
        },
      });
      if (!chapters) {
        return res.status(404).json({ error: 'El anime no tiene capitulos' });
      }
      console.log(`Eliminando capitulos del anime con id ${mal_id}`);
      await ChapterModel.destroy({
        where: {
          anime_mal_id: mal_id,
        },
      });
      console.log(`Capitulos del anime con id ${mal_id} eliminados`);
      res.status(204).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'No se pudo eliminar los capitulos' });
    }
  }
);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
