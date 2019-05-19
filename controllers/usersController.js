import db from '../utils/db';
import fetch from 'node-fetch';

export default {
    async findAll(req, res, next) {
        const offset = parseInt(req.query.offset) || 0;
        const perPage = parseInt(req.query.count) || 10;

        const usersPromise = db.get().collection('users')
            .find()
            .skip(offset)
            .limit(perPage)
            .sort({_id: -1})
            .toArray()

        const countPromise = db.get().collection('users').countDocuments({});

        const [ users, count ] = await Promise.all([usersPromise, countPromise]);

        if (!users) {
            return next();
        }

        return res.status(200).send({users, count});
    },

    async findOne(req, res, next) {
        const id = parseInt(req.params.id, 10)
        const user = await db.get().collection('users')
            .findOne({_id: id})

        if (!user) {
            return next();
        }
    
        return res.status(200).send(user);
    },

    async generateFake(req, res, next) {
        const count = parseInt("1", 10);
        const randomUserApi = `https://randomuser.me/api/?results=${count}`;
    
        const { results } = await fetch(randomUserApi).then(res => res.json());
    
        const id = await db.getNextSequence("userid");
        const users = results.map(r => ({
            _id: id,
            githubLogin: r.login.username,
            name: `${r.name.first} ${r.name.last}`,
            avatar: r.picture.thumbnail,
            githubToken: r.login.sha1
        }))
    
        await db.get().collection('users').insertOne(users[0]);
    
        let newUsers = await db.get().collection('users')
            .find()
            .sort({_id: -1})
            .limit(count)
            .toArray()
        
        return res.status(201).send(newUsers);
    },

    async update(req, res, next) {
        const id = parseInt(req.params.id, 10);
        const newValues = { $set: req.body }

        const updatedUser = await db.get().collection('users')
            .updateOne(
                { _id: id },
                newValues
            )

        if (!updatedUser) {
            return next();
        }

        if (updatedUser.matchedCount) {
            return res.sendStatus(200);
        }   
    },

    async remove (req, res, next) {
        const id = parseInt(req.params.id, 10);
    
        db.get().collection('users')
            .deleteOne({_id: id}, (err, user) => {
                if (!user.deletedCount) {
                    return next();
                } 
                return res.sendStatus(204);
            })
    }
}