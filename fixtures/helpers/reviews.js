const faker = require('faker');

const RATING_MIN = 1;
const RATING_MAX = 5;

const getRating = () =>
  faker.random.number({ min: RATING_MIN, max: RATING_MAX });

const getRandomUserIdFromList = (userList) => {
  const lastUserIndex = userList.length - 1;
  const randomIndex = faker.random.number({ min: 0, max: lastUserIndex });
  const { _id } = userList[randomIndex];
  return _id;
};

const createFacilityReview = (userId, facilityId) => {
  const MAX_SENTENCES_NUMBER = 7;
  const sentencesNumber = faker.random.number({
    min: 1,
    max: MAX_SENTENCES_NUMBER
  });
  return {
    author: userId,
    facility: facilityId,
    description: faker.lorem.sentences(sentencesNumber),
    foodQuality: getRating(),
    serviceQuality: getRating(),
    interior: getRating()
  };
};

const createFacilityReviews = (facilityId, usersList, reviewsMaxNumber) => {
  const reviewsNumber = faker.random.number({ min: 0, max: reviewsMaxNumber });
  const reviewsList = [];
  for (let i = 0; i < reviewsNumber; i++) {
    const userId = getRandomUserIdFromList(usersList);
    const review = createFacilityReview(userId, facilityId);
    reviewsList.push(review);
  }
  return reviewsList;
};

module.exports = createFacilityReviews;
