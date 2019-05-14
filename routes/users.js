import { Router } from 'express';
import fetch from 'node-fetch';
import MongoDB from '../utils/db';
const db = MongoDB.get();


const router = Router();

router.get('/', (req, res) => {
    console.log('/users received get')
    return res.status(200).send({"msg":"ok"});
    // return res.send('/users')
})

router.post('/fake', async (req,res) => {
    const count = parseInt(req.query.count);
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;

    const { results } = await fetch(randomUserApi).then(res => res.json());

    const users = results.map(r => ({
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1
    }))

    await db.collection('users').insertMany(users);

    let newUsers = await db.collection('users')
        .find()
        .sort({_id: -1})
        .limit(count)
        .toArray()
    
    res.status(201).send(newUsers);
})

export default router;