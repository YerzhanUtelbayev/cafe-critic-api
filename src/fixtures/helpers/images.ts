import faker from 'faker';
import { ObjectId } from 'mongodb';

import User from '../../interfaces/user.interface';
import Image from '../../interfaces/image.interface';

const createFacilityImage = (
  facilityId: ObjectId | string,
  userId: ObjectId | string,
  imageFileName: string,
): Image => {
  return {
    author: userId,
    facility: facilityId,
    image: imageFileName
  };
};

const createFacilityImages = (
  facilityId: ObjectId | string,
  usersList: User[],
  imageFileNamesList: string[],
  maxNumber: number
): Image[] => {
  const imagesCount = faker.random.number({ min: 0, max: maxNumber });
  const usersListLastIndex = usersList.length - 1;
  const imagesListLastIndex = imageFileNamesList.length - 1;
  const facilityImagesList = [];

  for (let i = 0; i < imagesCount; i++) {
    const userIndex = faker.random.number({ min: 0, max: usersListLastIndex });
    const user = usersList[userIndex];
    if (user._id) {
      const imageIndex = faker.random.number({
        min: 0,
        max: imagesListLastIndex
      });
      const imageFilename = imageFileNamesList[imageIndex];
      const createdData = createFacilityImage(
        facilityId,
        user._id,
        imageFilename
      );
      facilityImagesList.push(createdData);
    }
  }

  return facilityImagesList;
};

export default createFacilityImages;
