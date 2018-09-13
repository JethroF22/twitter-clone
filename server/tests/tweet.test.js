const request = require('supertest');
const expect = require('chai').expect;
const { ObjectID } = require('mongodb');

const app = require('../server');
const Tweet = require('../models/tweet');
const { tweets, users, populateTweets } = require('./seed/seed');

let tweet, id, token, user;

describe('/tweet', () => {
  describe('POST', () => {
    beforeEach(() => {
      tweet = tweets[1];
      user = users[0];
    });
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

  describe('PATCH', () => {
    beforeEach(function(done) {
      this.timeout(0);
      populateTweets(done);
    });

    describe('/retweet/:id', () => {
      it('should update a tweet', done => {
        tweet = tweets[1];
        id = tweet._id;
        user = users[0];
        token = user.token;

        request(app)
          .patch(`/tweet/retweet/${id}`)
          .set('x-token', token)
          .expect(200)
          .expect(res => {
            expect(res.body.retweets).to.equal(1);
          })
          .end(done);
      });

      it('should prevent multiple retweets', done => {
        tweet = tweets[0];
        user = users[1];
        id = tweet._id;
        token = user.token;

        request(app)
          .patch(`/tweet/retweet/${id}`)
          .set('x-token', token)
          .expect(400)
          .expect(res => {
            expect(res.error.text).to.equal(
              'Cannot retweet the same tweet more than once'
            );
          })
          .end(done);
      });

      it('should return an error for non-existent ids', done => {
        id = new ObjectID();

        request(app)
          .patch(`/tweet/retweet/${id}`)
          .set('x-token', token)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('Tweet not found');
          })
          .end(done);
      });
    });
  });
});
