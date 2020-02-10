import should from 'should';
// import sinon from 'sinon';
// import articlesController from '../controllers/articlesController';
// import Article from '../models/Article'
import request from 'supertest';
import db from '../utils/db';
import app from '../index';

process.env.ENV = 'Test';

const agent = request.agent(app);

describe('Article Crud Test', () => {
  it('should allow an article to be posted', (done) => {
    const article = {
      title: 'title',
      lead: 'lead',
      content: 'content',
      image_url: 'url',
      categories_ids: [1, 2],
    };

    agent.post('/api/v1/articles')
      .send(article)
      .expect(201)
      .end((err, results) => {
        result.body.title.should.not.equal('title');
        results.body.should.have.property('_id');
        done();
      });
  });

  afterEach((done) => {
    done();
  });

  after((done) => {
    db.close();
    done();
  });
});
