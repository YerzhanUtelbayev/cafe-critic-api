export default interface Facility {
  _id?: string;
  owner?: string;
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
