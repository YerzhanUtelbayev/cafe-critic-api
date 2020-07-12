import { ObjectId } from 'mongodb'

export default interface User {
  _id?: string | ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  password: string;
  avatarImage: string;
  role: string;
  address?: {
    street: string,
    city: string,
    country: string
  };
}
