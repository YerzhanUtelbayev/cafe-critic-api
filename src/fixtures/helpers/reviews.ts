import faker from 'faker';
import { ObjectId } from 'mongodb';

import User from '../../interfaces/user.interface';
import Review from '../../interfaces/review.interface';

const RATING_MIN = 1;
const RATING_MAX = 5;

const getRating = () =>
  faker.random.number({ min: RATING_MIN, max: RATING_MAX });

const getRandomUserIdFromList = (userList: User[]): string | ObjectId => {
  const lastUserIndex = userList.length - 1;
  const randomIndex = faker.random.number({ min: 0, max: lastUserIndex });
  const { _id } = userList[randomIndex];
  if (!_id) return new ObjectId();
  return _id;
};

const createFacilityReview = (
  facilityId: string | ObjectId,
  userId: string | ObjectId
) => {
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

const createFacilityReviews = (
  facilityId: ObjectId | string,
  usersList: User[],
  reviewsMaxNumber: number
): Review[] => {
  const reviewsNumber = faker.random.number({ min: 0, max: reviewsMaxNumber });
  const reviewsList = [];
  for (let i = 0; i < reviewsNumber; i++) {
    const userId = getRandomUserIdFromList(usersList);
    const review = createFacilityReview(facilityId, userId);
    reviewsList.push(review);
  }
  return reviewsList;
};

export default createFacilityReviews;
