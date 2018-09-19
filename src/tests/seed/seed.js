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

export const userProfiles = [
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1053775/pexels-photo-1053775.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    photo:
      'https://images.pexels.com/photos/1409980/pexels-photo-1409980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  },
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1399282/pexels-photo-1399282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350'
  },
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1130287/pexels-photo-1130287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1416822/pexels-photo-1416822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  }
];
