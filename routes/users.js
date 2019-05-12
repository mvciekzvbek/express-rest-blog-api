import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    console.log('/users received get')
    return res.status(200).send({"msg":"ok"});
    // return res.send('/users')
})

export default router;