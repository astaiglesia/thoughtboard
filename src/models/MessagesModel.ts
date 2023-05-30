import { Schema, model } from 'mongoose';

import { Message } from 'lib_ts/types';

const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  author: { type: String },    //, required: true }, for guests? (default to username if signed in)
  userID: { type: String },
  props: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const MessageModel = model<Message>('Message', MessageSchema);

export default MessageModel;
