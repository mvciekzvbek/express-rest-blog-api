import db from '../utils/db';
import prepareFilter from '../utils/filter';

export default {
    async create (req, res, next) {
        const id = await db.getNextSequence("articleid");
        const currentUser = req.user;

        const categoriesNames = req.body.categories;
        let categoriesIds = [];
    
        for (let name of categoriesNames) {
            const category = await db.get()
                .collection('categories')
                .findOne({name: name});
    
            categoriesIds.push(category["_id"])
        }
    
        let body = req.body;
        delete body.categories;

        if (!currentUser) {
            return res.sendStatus(403);
        }

        const article = {
            ...body,
            "_id": id,
            "author_name": currentUser.githubLogin,
            "created": Date.now(),
            "categories_ids": categoriesIds

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
        let { start, first } = req.query;
        
        start = parseInt(start) || 0;
        first = parseInt(first) || 6;

        const filter = prepareFilter(req.query);
        
        const articlesPromise = db.get().collection('articles')
            .find()
            .skip(start)
            .limit(first)
            .sort({_id: -1})
            .toArray()

        const countPromise = db.get().collection('articles').countDocuments({});

        const [ articles, count ] = await Promise.all([articlesPromise, countPromise]);

        if (!articles) {
            return res.status(404).send({"error": "Not found"})
        }

        return res.status(200).send({articles, count});
    },

    async findOne(req, res, next) {
        const id = parseInt(req.params.id, 10)
        const article = await db.get().collection('articles')
            .findOne({_id: id})

        if (!article) {
            return res.status(404).send({"error": "Not found"})
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