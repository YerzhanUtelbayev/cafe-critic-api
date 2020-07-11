const faker = require('faker');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

const syncGetPassword = (plainPassword) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};

module.exports = [
  {
    _id: ObjectID(),
    address: faker.address.streetAddress(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: syncGetPassword('user'),
    avatarImage: faker.image.avatar(),
    role: 'user'
  }
];
