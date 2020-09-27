import DbService from '../services/DbService';
import dbProvider from '../providers/DbProvider';

const dbService = DbService(dbProvider);

export default {
  async findAll(req, res, next) {
    const records = await dbService.getAllCategories();
    return res.status(200).send(records);
  },
  async findOne(req, res, next) {},
  async update(req, res, next) {},
  async remove(req, res, next) {},
  async findCategoryArticles(req, res, next) {},
};
