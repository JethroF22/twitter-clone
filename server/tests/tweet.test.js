const request = require('supertest');
const expect = require('chai').expect;

const app = require('../server');
const Tweet = require('../models/tweet');
const { tweets, users } = require('./seed/seed');

let tweet = tweets[0];
let user = users[1];

describe('/tweet', () => {
  describe('POST', () => {
    describe('/create', () => {
      it('should create a new tweet', done => {
        request(app)
          .post('/tweet/create')
          .send(tweet)
          .set('x-token', user.token)
          .expect(200)
          .expect(res => {
            expect(res.body.body).to.equal(tweet.body);
            expect(res.body.user.name).to.equal(user.name);
          })
          .end(done);
      });

      it('should return an error for unauthorized requests', done => {
        request(app)
          .post('/tweet/create')
          .send(tweet)
          .expect(401)
          .end(done);
      });

      it('should return an error message for invalid requests', done => {
        tweet = {};
        request(app)
          .post('/tweet/create')
          .send(tweet)
          .set('x-token', user.token)
          .expect(400)
          .expect(res => {
            expect(res.body[0].msg).to.equal('Path `body` is required.');
          })
          .end(done);
      });
    });
  });
});
