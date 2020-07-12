import faker from 'faker';
import { ObjectID } from 'mongodb';
import bcrypt from 'bcrypt';

const syncGetPassword = (plainPassword: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};

const createUser = () => {
  return {
    _id: new ObjectID(),
    address: {
      city: faker.address.city(),
      country: faker.address.country(),
      street: faker.address.streetAddress(),
    },
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: syncGetPassword('user'),
    avatarImage: faker.image.avatar(),
    role: 'user'
  };
};

const createUsersByNumber = (usersNumber: number) => {
  if (usersNumber > 0) {
    const usersList = [];
    for (let i = 0; i < usersNumber; i++) {
      const user = createUser();
      usersList.push(user);
    }
    return usersList;
  } else {
    return [];
  }
};

export default createUsersByNumber;
