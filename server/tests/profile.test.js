const request = require('supertest');
const { expect } = require('chai');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users, userProfiles } = require('./seed/seed');

let user, id, profile;

describe('/profile', () => {
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
