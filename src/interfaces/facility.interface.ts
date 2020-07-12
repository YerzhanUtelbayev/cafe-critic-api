import { ObjectId } from 'mongodb'

export default interface Facility {
  _id?: string | ObjectId;
  owner?: string | ObjectId;
  title: string;
  description: string;
  promoImage: string;
  reviewsNumber?: number;
  ratings?: {
    overall: number,
    food: number,
    service: number,
    interior: number,
  }
}
