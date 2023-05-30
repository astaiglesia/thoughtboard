import { Router } from 'express';

import MessageController from './messages.controller';
import { processResponse } from '../../lib_utils/helpers';


const MessageRouter: Router = Router()
  .get('/:messageID', MessageController.getByID, processResponse(200))
  .put('/:messageID', MessageController.editItem, processResponse(200))
  .delete('/:messageID', MessageController.deleteItem, processResponse(200))

  .get('/', MessageController.getCollection, processResponse(200))
  .post('/', MessageController.postNewItem, processResponse(201))
  .delete('/', MessageController.deleteAllItems, processResponse(200))

  .delete('/selection', MessageController.deleteSelection, processResponse(200));

export default MessageRouter;
