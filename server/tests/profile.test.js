const request = require('supertest');
const { expect } = require('chai');
const { ObjectID } = require('mongodb');

const app = require('../server');
const { populateUsers, users, userProfiles } = require('./seed/seed');

let user, id, profile;

describe('/profile', () => {
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
  });
});
