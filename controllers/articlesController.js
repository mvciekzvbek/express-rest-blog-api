import DbService from '../services/DbService';
import dbProvider from '../providers/DbProvider';
import Article from '../models/Article';

const dbService = DbService(dbProvider);

export default {
  async create(req, res, next) {
    const { user, body } = req;

    if (!user) {
      return res.sendStatus(401);
    }

    if (!body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    const article = new Article(body);

    const record = await dbService.createArticle(article);

    if (!record) {
      return res.status(400).send({
        message: 'Unable to save article in database',
      });
    }

    return res.status(201).send(record);
  },

  async findAll(req, res, next) {
    const records = await dbService.getArticles();
    return res.status(200).send(records);
  },
};
