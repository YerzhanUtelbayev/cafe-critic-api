const faker = require('faker');
const { ObjectID } = require('mongodb');

const createFacility = (user, imageFilenamesList) => {
  const imagesListLastIndex = imageFilenamesList.length - 1;
  return {
    _id: ObjectID(),
    owner: user._id,
    title: faker.company.companyName(),
    description: faker.lorem.paragraph(5),
    promoImage: imageFilenamesList[faker.random.number({ min: 0, max: imagesListLastIndex })],
    reviewsNumber: 0
  };
};

const createFacilities = (usersList, imageFilenamesList) => {
  if (usersList && Array.isArray(usersList) && usersList.length > 0) {
    return usersList.map((user) => createFacility(user, imageFilenamesList));
  } else {
    return [];
  }
};

module.exports = createFacilities;
