import { ObjectID } from 'mongodb';

export const userID = new ObjectID();
export const tweetID = new ObjectID();

export const users = [
  {
    name: 'Jethro Fredericks',
    password: 'iamjethro',
    handle: 'KingJethro',
    email: 'jethro@gmail.com'
  },
  {
    name: 'Neill Gerber',
    password: 'iamneill',
    handle: 'NeillG',
    email: 'neillg@gmail.com'
  },
  {
    name: 'Justin Heidoe',
    password: 'iamjustin',
    handle: 'TheIndian',
    email: 'justin@gmail.com'
  }
];

export const tweets = [
  {
    body: 'This is a test',
    user: {
      _id: userID
    },
    _id: tweetID
  },
  {
    body: 'Peter Piper picked a peck of pickled peppers',
    user: {
      _id: userID
    }
  }
];
