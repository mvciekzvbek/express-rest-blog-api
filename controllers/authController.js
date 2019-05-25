import 'dotenv/config';
import db from '../utils/db';
import { authorizeWithGithub } from '../utils/auth';

console.log(authorizeWithGithub);


export default {
    async githubAuth (req, res, next) {
        console.log('githubAuth');
        const code = req.headers.code;
        console.log(code);
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
        }

        let latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url
        }

        const { ops:[user], result } = await db.get()
            .collection('users')
            .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true})

        return { user, token: access_token }
    }
}