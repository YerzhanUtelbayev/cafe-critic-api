export default interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  avatarImage: string;
  role: string;
  address?: {
    street: string,
    city: string,
  };
}
