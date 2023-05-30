import { Schema, model } from 'mongoose';
import { User } from 'lib_ts/types';

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {
    type: String,
    unique: true 
  },
  firstName: { type: String },
  lastName: { type: String },
  location: { type: String, default: 'earth' },
  friends: { type: [String], default: [] },
  role: { type: String },
});
const UserModel = model<User>('User', UserSchema);

export default UserModel;
