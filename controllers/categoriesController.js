import db from '../db/index';

export default {
  async findAll(req, res, next) {
    const query = {
      text: 'SELECT * FROM categories',
    };

    const { rows } = await db.query(query);

    return res.status(200).send(rows);
  },

  async findOne(req, res, next) {
  },

  async update(req, res, next) {
  },

  async remove(req, res, next) {
  },

  async findCategoryArticles(req, res, next) {
  },
};
