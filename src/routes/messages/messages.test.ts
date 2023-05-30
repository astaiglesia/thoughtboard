import request from 'supertest';

import app from '../../app';
import { mongoConnect, mongoDisconnect } from '../../services/mongo';
import { Message } from 'lib_ts/types';

xdescribe('<>___MESSAGES API___<>', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  xdescribe('--- API ==> gets all messages', () => {
    test('should GET all messages and respond with a 200', async () => {
      const response = await request(app).get('/api/messages');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('--- API ==> posts, edits, gets, and deletes specified messages', () => {
    let payload: Message = {
      content:
        'Activate Interlocks, Dynotherms Connected, Megathrusters are go!',
      author: 'Sven',
      userID: '2308hnadva',
      props: 0,
    };

    test('should POST a new message and respond with 201', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send(payload);

      expect(response.statusCode).toBe(201);

      payload = response.body;
    });

    test('should PUT a param specified message and respond with 200', async () => {
      payload.props = 555;
      const response = await request(app)
        .put(`/api/messages/${payload._id}`)
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json')
        .send(payload);

      expect(response.statusCode).toBe(200);

      const updatedItem = await request(app).get(
        `/api/messages/${payload._id}`
      );
      expect(updatedItem.body.props).toBe(555);
    });

    test('should GET a param specified message and respond with 200', async () => {
      const response = await request(app).get(`/api/messages/${payload._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.props).toBe(555);

      payload = response.body;
    });

    test('should DELETE a param specified message and respond with 200', async () => {
      const response = await request(app).delete(
        `/api/messages/${payload._id}`
      );

      expect(response.statusCode).toBe(200);
    });
  });

  xdescribe('--- API ==: restricts admin only logic', () => {
    test('delete ALL messages should be restricted', () => {});
    test('delete MANY messages should be restricted', () => {});
  });
});
