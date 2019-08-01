import 'dotenv/config';
import db from '../utils/db';
import { authorizeWithGithub } from '../utils/auth';

export default {
    async githubAuth (req, res, next) {
        const code = req.headers.code;

        let {
            message,
            access_token,
            avatar_url,
            login,
            name
        } = await authorizeWithGithub({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code
        });
        
        if (message) {
            throw new Error (message);
            return next();
        }
        
        let latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar_url: avatar_url
        }

        const result = await db.get()
            .collection('users')
            .findOne({name: latestUserInfo.name});

        let usr;

        if (result) {
            const { ops:[user] } = await db.get()
                .collection('users')
                .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true})
            usr = user;
        } else {
            const id = await db.getNextSequence("userid");
            latestUserInfo = {
                _id: id,
                ...latestUserInfo
            }

            const { ops:[user] } = await db.get().collection('users').insertOne(latestUserInfo);
            usr = user;
        }

        res.status(200).send({ user: usr, token: access_token });
    }
}