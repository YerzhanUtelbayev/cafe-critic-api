export default interface Review {
  _id?: string;
  author?: string;
  facility: string;
  description: string;
  foodQuality: number;
  serviceQuality: number;
  interior: number;
}
