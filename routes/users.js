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
    const id = parseInt(req.query.id, 10)
    const users = await db.get().collection('users')
        .find()
        .sort({_id: -1})
        .toArray()

    return res.status(200).send(users);
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

    await db.get().collection('users').insert(users[0]);

    let newUsers = await db.get().collection('users')
        .find()
        .sort({_id: -1})
        .limit(count)
        .toArray()
    
    res.status(201).send(newUsers);
})

export default router;