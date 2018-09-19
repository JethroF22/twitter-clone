import { ObjectID } from 'mongodb';

const userOneID = new ObjectID().toHexString();
const userTwoID = new ObjectID().toHexString();
const userThreeID = new ObjectID().toHexString();
export const tweetID = new ObjectID();

export const users = [
  {
    _id: userOneID,
    name: 'Jethro Fredericks',
    password: 'iamjethro',
    handle: 'KingJethro',
    email: 'jethro@gmail.com'
  },
  {
    _id: userTwoID,
    name: 'Neill Gerber',
    password: 'iamneill',
    handle: 'NeillG',
    email: 'neillg@gmail.com'
  },
  {
    _id: userThreeID,
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
      _id: userOneID
    },
    _id: tweetID
  },
  {
    body: 'Peter Piper picked a peck of pickled peppers',
    user: {
      _id: userTwoID
    }
  }
];

export const userProfiles = [
  {
    name: users[0].name,
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1053775/pexels-photo-1053775.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    photo:
      'https://images.pexels.com/photos/1409980/pexels-photo-1409980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  },
  {
    name: users[1].name,
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1399282/pexels-photo-1399282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350'
  },
  {
    name: users[2].name,
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1130287/pexels-photo-1130287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1416822/pexels-photo-1416822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  }
];
