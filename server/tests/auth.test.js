const request = require('supertest');
const { expect } = require('chai');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users } = require('./seed/seed');

describe('/auth', () => {
  describe('/register', () => {
    let user;

    before(function(done) {
      this.timeout(0);
      populateUsers(done);
    });

    it('should create a new user', done => {
      user = {
        username: 'Jeremiah',
        handle: 'king_jerry',
        email: 'jeremiah@gmail.com',
        password: 'password1234'
      };

      request(app)
        .post('/auth/register')
        .send(user)
        .expect(200)
        .expect(res => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.handle).to.equal(user.handle);
        })
        .end(err => {
          if (err) done(err);

          User.findOne({ email: user.email })
            .then(dbUser => {
              expect(dbUser.password).to.not.equal(user.password);
              done();
            })
            .catch(err => done(err));
        });
    });

    it('should return an error for invalid credentials', done => {
      user = {
        username: 'Jeff',
        handle: 'jeff',
        email: 'lakjsdfkjkje'
      };
      request(app)
        .post('/auth/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.length).to.equal(4);
        })
        .end(done);
    });

    it('should return an error for duplicate emails', done => {
      user = users[0];

      request(app)
        .post('/auth/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body[0]).to.equal('This email is already in use');
        })
        .end(done);
    });
  });
});
