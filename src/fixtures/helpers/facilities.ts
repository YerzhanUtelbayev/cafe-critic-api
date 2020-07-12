import faker from 'faker';
import { ObjectID } from 'mongodb';

import User from '../../interfaces/user.interface';

const createFacility = (user: User, imageFilenamesList: string[]) => {
  const imagesListLastIndex = imageFilenamesList.length - 1;
  return {
    _id: new ObjectID(),
    owner: user._id,
    title: faker.company.companyName(),
    description: faker.lorem.paragraph(5),
    promoImage: imageFilenamesList[faker.random.number({ min: 0, max: imagesListLastIndex })],
    reviewsNumber: 0
  };
};

const createFacilities = (usersList: User[], imageFilenamesList: string[]) => {
  if (usersList && Array.isArray(usersList) && usersList.length > 0) {
    return usersList.map((user) => createFacility(user, imageFilenamesList));
  } else {
    return [];
  }
};

export default createFacilities;
