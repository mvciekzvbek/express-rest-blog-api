import db from '../utils/db';

export default {
    async create (req, res, next) {
        const id = await db.getNextSequence("articleid");

        const article = {
            ...req.body,
            "_id": id,
            "created": Date.now()
        }

        await db.get().collection('articles').insertOne(article);

        const newArticle = await db.get().collection('articles')
            .find()
            .sort({_id: -1})
            .limit(1)
            .toArray()

        return res.status(201).send(newArticle);
    },

    async findAll(req, res, next) {
        const offset = parseInt(req.query.offset) || 0;
        const perPage = parseInt(req.query.count) || 10;

        const articlesPromise = db.get().collection('articles')
            .find()
            .skip(offset)
            .limit(perPage)
            .sort({_id: -1})
            .toArray()

        const countPromise = db.get().collection('articles').countDocuments({});

        const [ articles, count ] = await Promise.all([articlesPromise, countPromise]);

        if (!articles) {
            return next();
        }

        return res.status(200).send({articles, count});
    },

    async findOne(req, res, next) {
        const id = parseInt(req.params.id, 10)
        const article = await db.get().collection('articles')
            .findOne({_id: id})

        if (!article) {
            return next();
        }
    
        return res.status(200).send(article);
    },

    async update(req, res, next) {
        const id = parseInt(req.params.id, 10);
        const newValues = { $set: req.body }

        const updatedArticle = await db.get().collection('articles')
            .updateOne(
                { _id: id },
                newValues
            )

        if (!updatedArticle) {
            return next();
        }

        if (updatedArticle.matchedCount) {
            return res.sendStatus(200);
        }   
    },

    async remove (req, res, next) {
        const id = parseInt(req.params.id, 10);
    
        db.get().collection('articles')
            .deleteOne({_id: id}, (err, article) => {
                if (!article.deletedCount) {
                    return next();
                } 
                return res.sendStatus(204);
            })
    }
}