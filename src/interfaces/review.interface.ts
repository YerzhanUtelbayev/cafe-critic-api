import { ObjectId } from 'mongodb'

export default interface Review {
  _id?: string | ObjectId;
  author?: string | ObjectId;
  facility: string | ObjectId;
  description: string;
  foodQuality: number;
  serviceQuality: number;
  interior: number;
}
