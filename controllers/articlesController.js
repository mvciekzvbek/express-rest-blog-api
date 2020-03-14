import db from '../db/index';
import Article from '../models/Article';

export default {
  async create (req, res, next) {
    const {
      user,
      body,
    } = req;

    if (!user) {
      return res.sendStatus(401);
    }

    // TODO:
    // validate fields
    // add categories
    if (!body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    const now = new Date();
    const query = {
      text: 'INSERT INTO articles(title, lead, body, image_url, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [body.title, body.lead, body.body, body.imageUrl, now, now],
    };

    const { rows } = await db.query(query);
    return res.status(201).send(rows[0]);
  },

  async findAll(req, res, next) {
    // TODO
    // queryparams - start, first, categories, author name, text

    const query = {
      text: 'SELECT * FROM articles ORDER BY id DESC OFFSET $1 FETCH FIRST $2 ROWS ONLY',
      values: [0, 5],
    };

    const { rows } = await db.query(query);

    return res.status(200).send(rows);
    // let { start, first } = req.query;
    //
    // start = parseInt(start, 10) || 0;
    // first = parseInt(first, 10) || 6;
    //
    // const filter = prepareArticleFilter(req.query);
    //
    // const articlesPromise = db.get().collection('articles')
    //   .find(filter)
    //   .skip(start)
    //   .limit(first)
    //   .sort({ _id: -1 })
    //   .toArray();
    // const returnArticles = articles.map((article) => {
    //   const newArticle = {...article};
    //   newArticle.links = {};
    //   newArticle.links.self = `http://${req.headers.host}/api/v1/articles/${article._id}`;
    //   return newArticle;
    // })
    //
    // let links = {};
    //
    // if(start - 6 >= 0) {
    //   links.prev = `http://${req.headers.host}/api/v1/articles?` +
    //     `start=${start - 6}&` +
    //     `first=${6}` +
    //     `${req.query.categories ? '&categories=' + req.query.categories : ''}` +
    //     `${req.query.author_name ? '&author_name=' + req.query.author_name : '' }` +
    //     `${req.query.id ? '&id=' + req.query.id : '' }`
    // }
    //
    // if(start + 6 < count) {
    //   links.next = `http://${req.headers.host}/api/v1/articles?` +
    //     `start=${start + 6}&` +
    //     `first=${6}` +
    //     `${req.query.categories ? '&categories=' + req.query.categories : ''}` +
    //     `${req.query.author_name ? '&author_name=' + req.query.author_name : '' }` +
    //     `${req.query.id ? '&id=' + req.query.id : '' }`
    // }
    //
    // return res.status(200).send({articles: returnArticles, count, links});
  },

  // async findOne(req, res, next) {
  //   const id = parseInt(req.params.id, 10);
  //   const article = await db.get().collection('articles')
  //     .findOne({ _id: id });
  //
  //   if (!article) {
  //     return res.sendStatus(404);
  //   }
  //
  //   const author = await db.get().collection('users')
  //     .findOne({ githubLogin: article.author_name });
  //
  //   const links = {}
  //   links.author = `http://${req.headers.host}/api/v1/users/${author._id}`
  //   links.sameCategory = `http://${req.headers.host}/api/v1/articles?categories=${article.categories_ids.join(',')}`
  //
  //   return res.status(200).send({...article, links});
  // },
  //
  // async update(req, res, next) {
  //   const currentUser = req.user;
  //
  //   if (!currentUser) {
  //     return res.sendStatus(401);
  //   }
  //
  //   const id = parseInt(req.params.id, 10);
  //   const newValues = { $set: req.body };
  //
  //   const updatedArticle = await db.get().collection('articles')
  //     .updateOne(
  //       { _id: id },
  //       newValues,
  //       { upsert: false }
  //     );
  //
  //
  //   if (!updatedArticle) {
  //     return res.status(404).send({ message: 'Not Found' });
  //   }
  //
  //   if (updatedArticle.upsertedId) {
  //     return res.status(201).send({ id: updatedArticle.upsertedId });
  //   }
  //
  //   if (updatedArticle.matchedCount) {
  //     return res.status(200).send({ message: 'OK' });
  //   }
  // },
  //
  // async remove(req, res, next) {
  //   const currentUser = req.user;
  //
  //   if (!currentUser) {
  //     return res.sendStatus(401);
  //   }
  //
  //   const id = parseInt(req.params.id, 10);
  //
  //   db.get().collection('articles')
  //     .deleteOne({ _id: id }, (err, article) => {
  //       if (!article.deletedCount) {
  //         return next();
  //       }
  //       return res.sendStatus(204);
  //     });
  // },
};
