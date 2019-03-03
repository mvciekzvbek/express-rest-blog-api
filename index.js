import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("OK");
});

const server = app.listen(process.env.PORT || 80, err => {
    if (err) {
        throw err
    }

    console.log("Started at http://localhost:%d\n", server.address().port);
});