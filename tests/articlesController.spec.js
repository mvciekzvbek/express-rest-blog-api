import should from 'should';
import sinon from 'sinon';
import articlesController from '../controllers/articlesController';
import Article from '../models/Article';

describe('Articles Controller Tests:', () => {
  describe('POST', () => {
    it('should not allow an empty title on article', () => {
      const req = {
        body: {
          id: 1,
          lead: 'lead',
          content: 'content',
          image_url: 'url',
          categories_ids: [1, 2],
        },
        user: { githubLogin: 'mvciekzvbek' },
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        sendStatus: sinon.spy(),
        json: sinon.spy(),
      };

      articlesController.create(req, res);
      res.status.calledWith(400).should.equal(true);
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});
