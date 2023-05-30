export interface User {
  _id?: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  friends?: string[];
  role?: string;
};
export type People = User[];

export type LoginDetails = {
  username: string;
  password: string;
}

export interface Message {
  _id?: string;
  author: string;
  userID?: string;
  content: string;
  props: number;
  created_at?: Date;
}
export type Messages = Message[];

export class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}


export type WordList = string[];