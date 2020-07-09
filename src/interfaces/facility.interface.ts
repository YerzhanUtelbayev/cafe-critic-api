export default interface Facility {
  _id?: string;
  owner?: string;
  title: string;
  description: string;
  promoImage: string;
  ratingsNumber?: number;
  ratings?: {
    overaLL: number,
    food: number,
    service: number,
    interior: number,
  }
}
