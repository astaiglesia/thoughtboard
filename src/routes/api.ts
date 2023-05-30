/** Routing for Mongo API  */
import express from 'express';

import MessageRouter from './messages/messages.router';
import UserRouter from './users/users.router';


const api = express.Router()
   .use('/users', UserRouter)
   .use('/messages', MessageRouter);
//.get('/photos', photos.router);

export default api;
