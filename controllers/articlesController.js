import { prepareArticleFilter } from '../utils/filters';
import db from '../utils/db';
import Article from '../models/Article'

export default {
  async create(req, res, next) {
    const currentUser = req.user;

    if (!currentUser) {
      return res.sendStatus(401);
    }

    if(!req.body.title) {
      res.status(400)
      return res.send('Title is required');
    }

    const id = await db.getNextSequence('articleid');
    const categoriesNames = req.body.categories;
    const categoriesIds = [];

    for (const name of categoriesNames) {
      const category = await db.get()
        .collection('categories')
        .findOne({ name });

      categoriesIds.push(category._id);
    }

    let data = {
      id,
      ...req.body,
      author_name: currentUser.githubLogin,
      categories_ids: categoriesIds
    }
    
    const article = new Article(data);

    const inserted = await db.get().collection('articles').insertOne(article);

    res.status(201)
    return res.send(inserted.ops[0]);
  },

  async findAll(req, res, next) {
    let { start, first } = req.query;

    start = parseInt(start, 10) || 0;
    first = parseInt(first, 10) || 6;

    const filter = prepareArticleFilter(req.query);

    const articlesPromise = db.get().collection('articles')
      .find(filter)
      .skip(start)
      .limit(first)
      .sort({ _id: -1 })
      .toArray();

    const countPromise = db.get().collection('articles').countDocuments(filter);

    const [articles, count] = await Promise.all([articlesPromise, countPromise]);

    if (!articles) {
      return res.sendStatus(404);
    }
    
    const returnArticles = articles.map((article) => {
      const newArticle = {...article};
      newArticle.links = {};
      newArticle.links.self = `http://${req.headers.host}/api/v1/articles/${article._id}`;
      return newArticle;
    })

    let links = {};

    if(start - 6 >= 0) {
      links.prev = `http://${req.headers.host}/api/v1/articles?` +
        `start=${start - 6}&` +
        `first=${6}` +
        `${req.query.categories ? '&categories=' + req.query.categories : ''}` +
        `${req.query.author_name ? '&author_name=' + req.query.author_name : '' }` +
        `${req.query.id ? '&id=' + req.query.id : '' }` 
    }

    if(start + 6 < count) {
      links.next = `http://${req.headers.host}/api/v1/articles?` +
        `start=${start + 6}&` +
        `first=${6}` +
        `${req.query.categories ? '&categories=' + req.query.categories : ''}` +
        `${req.query.author_name ? '&author_name=' + req.query.author_name : '' }` +
        `${req.query.id ? '&id=' + req.query.id : '' }`
    }

    return res.status(200).send({articles: returnArticles, count, links});
  },

  async findOne(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const article = await db.get().collection('articles')
      .findOne({ _id: id });

    if (!article) {
      return res.sendStatus(404);
    }

    const author = await db.get().collection('users')
      .findOne({ githubLogin: article.author_name });

    const links = {}
    links.author = `http://${req.headers.host}/api/v1/users/${author._id}`
    links.sameCategory = `http://${req.headers.host}/api/v1/articles?categories=${article.categories_ids.join(',')}`

    return res.status(200).send({...article, links});
  },

  async update(req, res, next) { 
    const currentUser = req.user;

    if (!currentUser) {
      return res.sendStatus(401);
    }

    const id = parseInt(req.params.id, 10);
    const newValues = { $set: req.body };

    const updatedArticle = await db.get().collection('articles')
      .updateOne(
        { _id: id },
        newValues,
        { upsert: false }
      );


    if (!updatedArticle) {
      return res.status(404).send({ message: 'Not Found' });
    }

    if (updatedArticle.upsertedId) {
      return res.status(201).send({ id: updatedArticle.upsertedId });
    }

    if (updatedArticle.matchedCount) {
      return res.status(200).send({ message: 'OK' });
    }
  },

  async remove(req, res, next) {
    const currentUser = req.user;
    
    if (!currentUser) {
      return res.sendStatus(401);
    }

    const id = parseInt(req.params.id, 10);

    db.get().collection('articles')
      .deleteOne({ _id: id }, (err, article) => {
        if (!article.deletedCount) {
          return next();
        }
        return res.sendStatus(204);
      });
  },
};
