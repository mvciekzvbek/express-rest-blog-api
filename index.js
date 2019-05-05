import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb'
import 'dotenv/config';

var db;

MongoClient.connect(process.env.DB_HOST, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log(`

            Mongo DB Host not found!
            please add DB_HOST environment variable to .env file
            exiting...

        `)
        process.exit(1);
    } 
    db = client.db();

    const server = app.listen(process.env.PORT || 3000, err => {
        if (err) {
            throw err
        }
    
        console.log("Started at http://localhost:%d\n", server.address().port);
    });
});


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routes
app.get("/", (req, res) => {
    res.send("Ready");
});