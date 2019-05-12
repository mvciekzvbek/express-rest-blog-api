import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log('/session received get')
    return res.status(200).send({"msg":"ok"});
    // return res.send('/session');
})

export default router;