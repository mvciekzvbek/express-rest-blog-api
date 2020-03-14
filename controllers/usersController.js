import fetch from 'node-fetch';
import db from '../db/index';
import User from '../models/User';

const hideTokens = users => users.map(el => ({
  id: el._id,
  githubLogin: el.githubLogin,
  name: el.name,
  avatar_url: el.avatar_url,
}));

export default {
  async findAll(req, res, next) {
    const offset = parseInt(req.query.offset, 10) || 0;
    const perPage = parseInt(req.query.count, 10) || 10;

    const usersPromise = db.get().collection('users')
      .find()
      .skip(offset)
      .limit(perPage)
      .sort({ _id: -1 })
      .toArray();

    const countPromise = db.get().collection('users').countDocuments({});

    const [users, count] = await Promise.all([usersPromise, countPromise]);

    if (!users) {
      return next();
    }

    const usersWithoutTokens = hideTokens(users);

    return res.status(200).send({ usersWithoutTokens, count });
  },

  async findOne(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const user = await db.get().collection('users')
      .findOne({ _id: id });

    if (!user) {
      return res.status(404).send({ message: 'Not Found' });
    }

    // const articles = await db.get().collection('articles')
    //   .find({ author_name: user.githubLogin })
    //   .sort({ _id: -1 })
    //   .toArray();

    const userWithoutToken = hideTokens([user])[0];

    const userWithArticles = {
      ...userWithoutToken,
    };

    return res.status(200).send(userWithArticles);
  },

  async generateFake(req, res, next) {
    const count = parseInt('1', 10);
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;

    const { results } = await fetch(randomUserApi).then(res => res.json());
    const id = await db.getNextSequence('userid');
    const users = results.map(r => ({
      id,
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar_url: r.picture.thumbnail,
      githubToken: r.login.sha1,
    }));

    const user = new User(users[0]);

    const inserted = await db.get().collection('users').insertOne(user);

    return res.status(201).send(inserted.ops[0]);
  },

  async update(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (req.body.token) {
      delete req.body.token;
    }
    const newValues = { $set: req.body };

    const updatedUser = await db.get().collection('users')
      .updateOne(
        { _id: id },
        newValues,
        { upsert: false },
      );

    if (!updatedUser.matchedCount) {
      return res.status(404).send({ message: 'Not Found' });
    }
    return res.sendStatus(200);
  },

  async remove(req, res, next) {
    const currentUser = req.user;

    if (!currentUser) {
      return res.sendStatus(401);
    }

    const id = parseInt(req.params.id, 10);

    db.get().collection('users')
      .deleteOne({ _id: id }, (err, user) => {
        if (!user.deletedCount) {
          return next();
        }
        return res.sendStatus(204);
      });
  },

  async findUserArticles(req, res, next) {
    const id = parseInt(req.params.id, 10);

    const user = await db.get().collection('users')
      .findOne({ _id: id });

    const articles = await db.get().collection('articles')
      .find({ author_name: user.githubLogin })
      .sort({ _id: -1 })
      .toArray();

    if (!articles) {
      return next();
    }

    return res.status(200).send(articles);
  },
};
