export default interface Facility {
  _id?: string;
  owner?: string;
  title: string;
  description: string;
  promoImage: string;
  ratings?: {
    overaLL: number,
    food: number,
    service: number,
    interior: number,
  }
}
