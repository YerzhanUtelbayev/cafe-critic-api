import { ObjectId } from 'mongodb'

export default interface Image {
  _id?: string | ObjectId;
  author?: string | ObjectId;
  facility: string | ObjectId;
  image: string;
}
