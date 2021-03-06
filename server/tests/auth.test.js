const request = require('supertest');
const { expect } = require('chai');

const app = require('../server');
const User = require('../models/user');
const { populateUsers, users } = require('../../config/seed');
const { errorMessages } = require('../../config/const.json');

const { DUPLICATE_EMAIL, INVALID_CREDENTIALS } = errorMessages;

describe('/auth', () => {
  let user;

  before(function(done) {
    this.timeout(0);
    populateUsers(done);
  });

  describe('/register', () => {
    before(function(done) {
      this.timeout(0);
      populateUsers(done);
    });

    it('should create a new user', done => {
      user = {
        name: 'Jeremiah',
        handle: 'king_jerry',
        email: 'jeremiah@gmail.com',
        password: 'password1234'
      };

      request(app)
        .post('/auth/register')
        .send(user)
        .expect(200)
        .expect(res => {
          expect(res.body.name).to.equal(user.name);
          expect(res.body.handle).to.equal(user.handle);
          expect(res.headers['x-auth']).to.be.a('string');
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
        name: 'Jeff',
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
      user = {
        name: 'Elijah',
        handle: 'TheProphet',
        email: users[0].email,
        password: 'iamelijah'
      };

      request(app)
        .post('/auth/register')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body[0].msg).to.equal(DUPLICATE_EMAIL);
        })
        .end(done);
    });
  });

  describe('/login', () => {
    it('should return user details and token on successful login', done => {
      user = users[0];

      request(app)
        .post('/auth/login')
        .send(user)
        .expect(200)
        .expect(res => {
          expect(res.headers['x-auth']).to.be.a('string');
          expect(res.body.name).to.equal(user.name);
          expect(res.body.handle).to.equal(user.handle);
        })
        .end(done);
    });

    it('should return an error message for bad requests', done => {
      user = {
        email: users[0].email,
        password: 'notmyrealpassword'
      };

      request(app)
        .post('/auth/login')
        .send(user)
        .expect(400)
        .expect(res => {
          expect(res.body.msg).to.equal(INVALID_CREDENTIALS);
        })
        .end(done);
    });
  });
});
