const faker = require('faker');

const createFacilityImage = (facilityId, userId, imageFileName) => {
  return {
    author: userId,
    facility: facilityId,
    image: imageFileName
  };
};

const createFacilityImages = (
  facilityId,
  usersList,
  imageFileNamesList,
  maxNumber
) => {
  const imagesCount = faker.random.number({ min: 0, max: maxNumber });
  const usersListLastIndex = usersList.length - 1;
  const imagesListLastIndex = imageFileNamesList.length - 1;
  const facilityImagesList = [];

  for (let i = 0; i < imagesCount; i++) {
    const userIndex = faker.random.number({ min: 0, max: usersListLastIndex });
    const user = usersList[userIndex];
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

  return facilityImagesList;
};

module.exports = createFacilityImages;
