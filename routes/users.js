import { Router } from 'express';
import fetch from 'node-fetch';
import db from '../utils/db';
const router = Router();

router.get('/', async (req, res) => {
    const users = await db.get().collection('users')
        .find()
        .sort({_id: -1})
        .toArray()

    return res.status(200).send(users);
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10)
    const user = await db.get().collection('users')
        .findOne({_id: id})

    return res.status(200).send(user);
})

router.post('/', async( req, res) => {

})

router.post('/fake', async (req,res) => {
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
    
    res.status(201).send(newUsers);
})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const newValues = { $set: req.body }

    const updatedUser = await db.get().collection('users')
        .updateOne(
            { _id: id },
            newValues
        )
    
    if (updatedUser.matchedCount) {
        return res.status(200)
    }   
})

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.get().collection('users')
        .deleteOne({_id: id}, (err, user) => {
            if (!user.deletedCount) {
                return res.sendStatus(404);
            } 
            res.sendStatus(204);
        })
});

export default router;