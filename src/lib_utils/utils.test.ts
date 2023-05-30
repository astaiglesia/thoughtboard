/** Utility Function Unit Tests
 *
 */
import { mongoConnect, mongoDisconnect } from '../services/mongo';
import { User } from '../../lib_ts/types';

import UserModel from '../models/UserModel';
import { UserUtilities } from '../routes/users/users.controller';
import generateUsername from './generateUsername';
import uniqueEmailGenerator from './uniqueEmailGenerator';

xdescribe('testing utility functions', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('<>___ generateUsername() ___<>', () => {
    let username: string;

    beforeAll(async () => {
      username = await generateUsername();
    });

    test('usernames should be unique', async () => {
      expect(await UserUtilities._isUniqueUsername(username)).toBe(true);
    });

    describe('--- valid usernames: ', () => {
      test('should be a string', () => {
        expect(typeof username).toBe('string');
      });
      test('should not contain whitespace', async () => {
        const hasWhitespace: boolean =
          username.search(/\s/g) < 0 ? false : true;
        expect(hasWhitespace).toBe(false);
      });
      test('should not be over 20 characters long', async () => {
        expect(username.length).toBeLessThan(21);
      });
    });
  });

  describe('<>___ uniqueEmailGenerator() ___<>', () => {
    let email: string;

    beforeAll(async () => {
      email = await uniqueEmailGenerator();
    });

    test('email should be a string', () => {
      expect(typeof email).toBe('string');
    });
    test('email is properly formatted', async () => {
      expect(UserUtilities._isValidEmail(email)).toBe(true);
    });
    test('email should not already be in the database', async () => {
      const user: User | null = await UserModel.findOne({ email });
      expect(user).toBe(null);
    });
  });
});
