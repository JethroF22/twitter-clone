const request = require('supertest');
const { expect } = require('chai');
const { ObjectID } = require('mongodb');

const app = require('../server');
const { populateUsers, users, userProfiles } = require('../../config/seed');

let user, id, profile;

describe('/profile', () => {
  describe('GET', () => {
    describe('/view/:id', () => {
      beforeEach(function(done) {
        this.timeout(0);
        user = users[2];
        profile = userProfiles[2];
        populateUsers(done);
      });

      it("should fetch a user's profile", done => {
        id = user._id;

        request(app)
          .get(`/profile/view/${id}`)
          .expect(200)
          .expect(res => {
            expect(res.body._id).to.equal(id);
          })
          .end(done);
      });

      it('should return an error for invalid ids', done => {
        id = new ObjectID();

        request(app)
          .get(`/profile/view/${id}`)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('User does not exist');
          })
          .end(done);
      });
    });
  });

  describe('PATCH', () => {
    describe('/edit', () => {
      beforeEach(function(done) {
        this.timeout(0);
        user = users[0];
        profile = userProfiles[0];
        populateUsers(done);
      });

      it("should update the user's details", done => {
        id = user._id;

        request(app)
          .patch('/profile/edit')
          .set('x-token', user.token)
          .send({ ...profile })
          .expect(200)
          .expect(res => {
            expect(res.body.bio).to.equal(profile.bio);
            expect(res.body.photo).to.equal(profile.photo);
            expect(res.body.coverPhoto).to.equal(profile.coverPhoto);
          })
          .end(done);
      });

      it('should return an error for unauthorised requests', done => {
        id = user._id;

        request(app)
          .patch('/profile/edit')
          .send({ ...profile })
          .expect(401)
          .expect(res => {
            expect(res.res.statusMessage).to.equal('Unauthorized');
          })
          .end(done);
      });

      it('should return errors for invalid data', done => {
        profile = {
          photo: 'notavalidurl',
          coverPhoto: ''
        };

        request(app)
          .patch('/profile/edit')
          .set('x-token', user.token)
          .send({ ...profile })
          .expect(400)
          .expect(res => {
            expect(res.body.length).to.equal(2);
          })
          .end(done);
      });
    });

    describe('/follow/:id', () => {
      beforeEach(function(done) {
        this.timeout(0);
        user = users[1];
        populateUsers(done);
      });

      it("should update 2 user's profiles", done => {
        const followedUser = users[2];

        request(app)
          .patch(`/profile/follow/${followedUser._id}`)
          .set('x-token', user.token)
          .expect(200)
          .expect(res => {
            expect(res.body.followedUser.followers.length).to.equal(1);
            expect(res.body.user.following.length).to.equal(1);
          })
          .end(done);
      });

      it('should return an error for invalid ids', done => {
        id = new ObjectID();

        request(app)
          .patch(`/profile/follow/${id}`)
          .set('x-token', user.token)
          .expect(404)
          .expect(res => {
            expect(res.error.text).to.equal('User does not exist');
          })
          .end(done);
      });

      it('should return an error for unauthorised requests', done => {
        id = user._id;

        request(app)
          .patch(`/profile/follow/${id}`)
          .expect(401)
          .expect(res => {
            expect(res.res.statusMessage).to.equal('Unauthorized');
          })
          .end(done);
      });

      it('should return an error for previously followed users', done => {
        user = users[0];
        id = users[1]._id;

        request(app)
          .patch(`/profile/follow/${id}`)
          .set('x-token', user.token)
          .expect(400)
          .expect(res => {
            expect(res.error.text).to.equal('Already following user');
          })
          .end(done);
      });
    });

    describe('/unfollow/:id', () => {
      beforeEach(function(done) {
        this.timeout(0);
        user = users[0];
        populateUsers(done);
      });

      it("should update 2 user's profiles", done => {
        const followedUser = users[1];

        request(app)
          .patch(`/profile/unfollow/${followedUser._id}`)
          .set('x-token', user.token)
          .expect(200)
          .expect(res => {
            expect(res.body.followedUser.followers.length).to.equal(0);
            expect(res.body.user.following.length).to.equal(0);
          })
          .end(done);
      });

      it('should return an error for unauthorised requests', done => {
        id = user._id;

        request(app)
          .patch(`/profile/unfollow/${id}`)
          .expect(401)
          .expect(res => {
            expect(res.res.statusMessage).to.equal('Unauthorized');
          })
          .end(done);
      });

      it("should return an error for users that haven't previously been followed", done => {
        user = users[1];
        id = users[2]._id;

        request(app)
          .patch(`/profile/unfollow/${id}`)
          .set('x-token', user.token)
          .expect(400)
          .expect(res => {
            expect(res.error.text).to.equal(
              'User is not currently being followed'
            );
          })
          .end(done);
      });
    });
  });
});
