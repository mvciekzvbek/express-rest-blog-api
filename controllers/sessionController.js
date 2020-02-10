import 'dotenv/config';
import db from '../utils/db';
import { authorizeWithGithub } from '../utils/auth';
import User from '../models/User';

export default {
  async githubAuth(req, res, next) {
    const { code } = req.headers;

    const {
      message,
      access_token,
      avatar_url,
      login,
      name,
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    if (message) {
      throw new Error(message);
      return next();
    }

    let data = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar_url,
    };

    const result = await db.get()
      .collection('users')
      .findOne({ name: data.name });

    let usr;

    if (result) {
      const { ops: [user] } = await db.get()
        .collection('users')
        .replaceOne({ githubLogin: login }, data, { upsert: true });
      usr = user;
    } else {
      const id = await db.getNextSequence('userid');
      data = {
        _id: id,
        ...data,
      };

      const user = new User(data);

      const inserted = await db.get().collection('users').insertOne(user);

      usr = inserted.ops[0];
    }

    return res.status(200).send({ user: usr, token: access_token });
  },
};
