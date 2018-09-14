const request = require('supertest');
const expect = require('chai').expect;
const { ObjectID } = require('mongodb');

const app = require('../server');
const Tweet = require('../models/tweet');
const User = require('../models/user');
const { tweets, users, populateTweets, populateUsers } = require('./seed/seed');

let tweet, id, token, user;

describe('/tweet', () => {
  describe('GET', () => {
    beforeEach(function(done) {
      this.timeout(0);
      user = users[1];
      populateTweets(done);
    });

    beforeEach(function(done) {
      populateUsers(done);
    });

    describe('/fetch_tweets/:id', () => {
      it('should fetch a users tweets', done => {
        id = user._id;

        request(app)
          .get(`/tweet/fetch_tweets/${id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.length).to.equal(2);
          })
          .end(done);
      });

      it('should return an error for invalid ids', done => {
        id = new ObjectID();

        request(app)
          .get(`/tweet/fetch_tweets/${id}`)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('User does not exist');
          })
          .end(done);
      });

      it("should return an error if the user hasn't created tweets", done => {
        user = users[2];
        id = user._id;

        request(app)
          .get(`/tweet/fetch_tweets/${id}`)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('User has not tweeted anything');
          })
          .end(done);
      });
    });
  });

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

    describe('/like/:id', () => {
      beforeEach(() => {
        tweet = tweets[0];
        id = tweet._id;
        user = users[1];
        token = user.token;
      });

      it('should like a tweet', done => {
        request(app)
          .patch(`/tweet/like/${id}`)
          .set('x-token', token)
          .expect(200)
          .expect(res => {
            expect(res.body.tweet.likes).to.equal(1);
            expect(res.body.user.likedTweets[0]).to.deep.equal({
              _id: id.toHexString()
            });
          })
          .end(done);
      });

      it('should stop users from liking their own tweets', done => {
        user = users[0];
        token = user.token;

        request(app)
          .patch(`/tweet/like/${id}`)
          .set('x-token', token)
          .expect(404)
          .end(done);
      });

      it('should send an error message for non-existent tweets', done => {
        id = new ObjectID();

        request(app)
          .patch(`/tweet/like/${id}`)
          .set('x-token', token)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('Tweet does not exist');
          })
          .end(done);
      });

      it('should stop users from liking the same tweet twice', done => {
        user = users[2];
        token = user.token;
        id = tweets[1]._id;

        request(app)
          .patch(`/tweet/like/${id}`)
          .set('x-token', token)
          .expect(400)
          .expect(res => {
            expect(res.error.text).to.equal(
              'User has already liked this tweet'
            );
          })
          .end(done);
      });
    });
  });

  describe('DELETE', () => {
    beforeEach(function(done) {
      this.timeout(0);
      populateTweets(done);
    });

    describe('/delete/:id', () => {
      it('should delete a tweet', done => {
        id = tweets[0]._id;
        token = users[0].token;

        request(app)
          .delete(`/tweet/delete/${id}`)
          .set('x-token', token)
          .expect(200)
          .end(err => {
            if (err) return done(err);

            User.findById(users[1]._id)
              .then(user => {
                expect(user.retweets.length).to.equal(0);
                done();
              })
              .catch(err => done(err));
          });
      });

      it('should send an error message for non-existent tweets', done => {
        id = new ObjectID();
        token = users[0].token;

        request(app)
          .delete(`/tweet/delete/${id}`)
          .set('x-token', token)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('This tweet does not exist');
          })
          .end(done);
      });

      it('should not allow users to delete other users tweets', done => {
        id = tweets[0]._id;
        token = users[1].token;

        request(app)
          .delete(`/tweet/delete/${id}`)
          .set('x-token', token)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('This tweet does not exist');
          })
          .end(done);
      });
    });
  });
});
