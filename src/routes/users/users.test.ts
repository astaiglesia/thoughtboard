const bcrypt = require('bcrypt');
import request from 'supertest';

import app from '../../app';
import { mongoConnect, mongoDisconnect } from '../../services/mongo';
import UserModel from '../../models/UserModel';
import { UserUtilities } from './users.controller';
import { LoginDetails, People, User } from 'lib_ts/types';
import uniqueEmailGenerator from '../../lib_utils/uniqueEmailGenerator';
import generateUsername from '../../lib_utils/generateUsername';
import { Error } from 'mongoose';

const {
  _isValidUsername,
  _isUniqueUsername,
  _isValidEmail,
  _isUniqueEmail,
  _isValidPassword,
  _encryptPassword,
} = UserUtilities;

async function generateUser(data: User) {
  return await request(app)
    .post('/api/users')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .send(data);
}
async function login(data: LoginDetails) {
  return await request(app)
    .post('/api/users/login')
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json')
    .send(data);
}

describe('<>___USERS API___<>', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('--- API ==> fetches users', () => {
    test('server should successfully connect to the database', () => {});
    test('should GET all users and respond with a 200', async () => {
      const response = await request(app).get('/api/users');
      // console.log("🚀 ~ file: users.test.ts:43 ~ test ~ response:", response.body)
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('--- API ==> manages the userbase', () => {
    test('should persist a new user + responds with added user and status 201', async () => {
      const response = await generateUser(testUser);
      expect(201);
      // console.log("🚀 ~ file: users.test.ts:63 ~ test ~ response:", response.body)

      if (response.statusCode === 201) {
        testUser = response.body;
        await seedFriends.forEach(async (item: User): Promise<void> => {
          const response = await generateUser(item);
          friendIDs.push(response.body._id);
          // console.log(
          //   '🚀 ~ file: users.test.ts:75 ~ seedFriends.forEach ~ response.body._id:',
          //   response.body
          // );
        });
      }
    });
    test('should find and return a user by id + respond with 200', async () => {
      const response = await request(app).get(`/api/users/${testUser._id}`);
      expect(200);
      expect(response.body.username).toBe('thejerseyDevil');
    });
    test('should edit a user profile and respond with an updated profile', async () => {
      testUser.lastName = 'McLovin';
      await request(app)
        .put(`/api/users/${testUser._id}`)
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send(testUser);
      expect(200);

      const updatedItem = await request(app).get(`/api/users/${testUser._id}`);
      expect(updatedItem.body.lastName).toBe('McLovin');
    });

    test('should add a single user id to a friends list and respond with the updated user', async () => {
      // console.log(friendIDs, "adding id's")
      await request(app)
        .put(`/api/users/${testUser._id}/friends`)
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send([friendIDs[0]]);
      expect(200);

      const updatedItem = await request(app).get(`/api/users/${testUser._id}`);
      expect(updatedItem.body.friends).toStrictEqual([friendIDs[0]]);
    });

    test('should add multiple user ids, unique only, to a friends list and respond with the updated user', async () => {
      console.log('------+ adding friendlist: ', friendIDs);
      await request(app)
        .put(`/api/users/${testUser._id}/friends`)
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send(friendIDs);
      expect(200);

      const updatedItem = await request(app).get(`/api/users/${testUser._id}`);
      expect(updatedItem.body.friends.sort()).toEqual(friendIDs.sort());
      expect(updatedItem.body.friends.length).toBe(friendIDs.length);
    });
    test('should delete a user by id and respond with 200', async () => {
      const response = await request(app).delete(`/api/users/${testUser._id}`);
      expect(200);
      expect(response.body.email).toBe(testUser.email);
    });
    test('should delete a selection of user ids', async () => {
      const response = await request(app)
        .delete(`/api/users/selection`)
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send(friendIDs);
      expect(200);
      expect(response.body).toHaveProperty('deletedCount');
      expect(response.body.deletedCount).toBe(friendIDs.length);
    });
  });

  describe('--- API ==> should provide input validation utilities', () => {
    let mockUser: User = {
      ...testUser,
      _id: undefined,
    };

    beforeAll(async () => {
      do {
        mockUser.username = await generateUsername();
      } while (mockUser.username.length > 20);

      mockUser.email = await uniqueEmailGenerator();
      mockUser.password = await _encryptPassword('1@Er$4<>ee'); // mocks a client side encrypted password
    });
    afterAll(async () => {
      await UserModel.findByIdAndDelete(mockUser._id);
    });

    describe('--- testing username validation', () => {
      test('usernames should be unique', async () => {
        const response = await _isUniqueUsername(mockUser.username);
        expect(response).toBe(true);
      });
      test('existing usernames should be flagged', async () => {
        mockUser = (await generateUser(mockUser)).body; // persisting mock user to expect a non-uniq username
        expect(await _isUniqueUsername(mockUser.username)).toBe(false);
      });
      test('usernames should be valid', () => {
        const hasSpaces = 'asfo 23s-@ ',
          tooLong = '902nJ))*bw03nkldlkjabfa823))*&^';
        expect(_isValidUsername(hasSpaces)).toBe(false);
        expect(_isValidUsername(tooLong)).toBe(false);
        expect(_isValidUsername(mockUser.username)).toBe(true);
      });
    });

    describe('--- testing email validation', () => {
      test('emails should be unique', async () => {
        const response: boolean = await _isUniqueEmail(
          await uniqueEmailGenerator()
        );
        expect(response).toBe(true);

        const emailUsed: boolean = await _isUniqueEmail(mockUser.email);
        expect(emailUsed).toBe(false);
      });
      test('emails should be valid', async () => {
        const badEmails = [
          'mysite.ourearth.com', // [@ is not present]
          'mysite@.com.my', // [ tld (Top Level domain) can not start with dot "." ]
          '@you.me.net', // [ No character before @ ]
          'mysite@', // [ No character after @ ]
          'my site@yahoo.com', // [ whitespace not allowed ]
          'mysite123@gmail.b', // [ ".b" is not a valid tld ]
          'mysite@.org.org', // [ tld can not start with dot "." ]
          '.mysite@mysite.org', // [ should not be start with "." ]
          'mysite()*@gmail.com', // [ only allow character, digit, underscore, and dash ]
          'mysite..1234@yahoo.com', // [double dots are not allowed]
        ];
        badEmails.forEach((email: string): void => {
          expect(_isValidEmail(email)).toBe(false);
        });
        expect(_isValidEmail('ryzen.intel@barbary-coast.net')).toBe(true);
      });
    });

    describe('--- testing password validation', () => {
      const validPassword = '!@na&1sHdg7(7A';

      describe('--- valid passwords', () => {
        /** client side password validation and encryption should occur
         * - these tests may be disabled for validated and encyrpted testUsers
         */
        const badPasswords = [
          // --- typechecking via TypeScript
          ['!@na1H', 'should be longer than 7 characters'],
          ['na1sHdg77A', 'should include a special character'],
          ['!@na&sHdg(A', 'should include a number'],
          ['!@na&1sdg7(7', 'should include an uppercase letter'],
          ['!@&1H7(7A', 'should include a lowercase letter'],
          ['!@na&1sHdg7(7Aee', 'should be shorter than 15 characters'],
          ['!@na&1sHdg7 7A', 'should not include whitespace'],
        ];

        test(`should be accepted`, () => {
          expect(_isValidPassword(validPassword)).toBe(true);
        });
        badPasswords.forEach(([pw, description]) => {
          test(`${description}`, () => {
            expect(_isValidPassword(pw)).toBe(false);
          });
        });
      });

      describe('--- passwords should be reliably hashed', () => {
        const saltRounds = 10;

        test('hashes should be distinct from the source string', async () => {
          const passwordHash = await bcrypt.hash(validPassword, saltRounds);
          expect(passwordHash).not.toBe(validPassword);
        });
        test('hash functions should be pure', async () => {
          const encryptedPW = await _encryptPassword(validPassword);
          expect(await bcrypt.compare(validPassword, encryptedPW)).toBe(true);
        });
      });
    });

    describe('--- persisted users should be authenticated', () => {
      const mockUser: User = {
        ...testUser,
        _id: undefined,
      };

      beforeAll(async () => {
        mockUser.username = await generateUsername();
        mockUser.email = await uniqueEmailGenerator();
        mockUser.password = await _encryptPassword('1@Er$4<>ee'); // mocks a client side encrypted password
      });
      afterAll(async () => {
        await UserModel.findByIdAndDelete(mockUser._id);
      });

      test('valid username + password combos should successfully authenticate', async function () {
        const { username, password } = mockUser;
        const badUsername = (await login({ username: '$X7m$X7m', password })).body;
        const badPassword = (await login({ username, password: '$X7m$X7m' })).body;
        const authenticated = (await login({ username, password })).body;

        expect(badUsername).toBeInstanceOf(Error);
        expect(badPassword).toBeInstanceOf(Error);
        expect(authenticated.statusCode).toBe(200);
      });
    });
  });

  describe('--- API ==> exposes admin only logic', () => {
    // [] implement a mocked database for testing?
    xtest('should delete all users and be restricted to admins', async () => {
      const response = await request(app).delete('/api/users/');
      expect(200);
      expect(response.body).toHaveProperty('deletedCount');
    });
  });
});


// --- seed data
const seedFriends: People = [
  {
    username: '1stjerseyDevil',
    password: 'P@55word',
    email: '1petit.prince@juno.com',
    firstName: 'Jack',
    lastName: 'Hughes',
    location: 'Prudential Center',
    friends: [],
  },
  {
    username: '2ndjerseyDevil',
    password: 'P@55word',
    email: '2petit.prince@juno.com',
    firstName: 'Jack',
    lastName: 'Hughes',
    location: 'Prudential Center',
    friends: [],
  },
  {
    username: '3rdjerseyDevil',
    password: 'P@55word',
    email: '3petit.prince@juno.com',
    firstName: 'Jack',
    lastName: 'Hughes',
    location: 'Prudential Center',
    friends: [],
  },
];

let testUser: User = {
  username: 'thejerseyDevil',
  password: 'P@55word',
  email: 'petit.prince@juno.com',
  firstName: 'Jack',
  lastName: 'Hughes',
  location: 'Prudential Center',
  friends: [],
};
const friendIDs: string[] = [];
