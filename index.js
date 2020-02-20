import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/api/v1/users', routes.users);
app.use('/api/v1/articles', routes.articles);
app.use('/api/v1/categories', routes.categories);
app.use('/api/v1/comments', routes.comments);

const server = app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    throw err;
  }

  console.log('Started at http://localhost:%d\n', server.address().port);
});

export default app;
