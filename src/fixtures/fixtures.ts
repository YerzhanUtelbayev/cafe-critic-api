import mongoose from 'mongoose';

import Image from '../interfaces/image.interface';
import Facility from '../interfaces/facility.interface';

import imageFileNames from './helpers/imageFilenames';
import createUsersByNumber from './helpers/users';
import createFacilities from './helpers/facilities';
import createFacilityImages from './helpers/images';
import createFacilityReviews from './helpers/reviews';

import userModel from '../models/user.model';
import facilityModel from '../models/facility.model';
import imageModel from '../models/image.model';
import reviewModel from '../models/review.model';
import ReviewService from '../controllers/review/review.service';
import ImageService from '../controllers/image/image.service';
import Review from '../interfaces/review.interface';

const USERS_NUMBER = 50;
const FACILITY_IMAGES_MAX_NUMBER = 20;
const FACILITY_REVIEWS_MAX_NUMBER = 20;

const reviewService = new ReviewService();
const imageService = new ImageService();

const usersList = createUsersByNumber(USERS_NUMBER);
const facilitiesList = createFacilities(usersList, imageFileNames.exterior);
const imagesList = facilitiesList.reduce((acc: Image[], facility: Facility) => {
  if (!facility._id) return acc;
  return [
    ...acc,
    ...createFacilityImages(
      facility._id,
      usersList,
      imageFileNames.interior,
      FACILITY_IMAGES_MAX_NUMBER
    )
  ];
}, []);
const reviewsList = facilitiesList.reduce(
  (acc: Review[], facility: Facility) => {
    if (!facility._id) return acc;
    return [
      ...acc,
      ...createFacilityReviews(
        facility._id,
        usersList,
        FACILITY_REVIEWS_MAX_NUMBER
      )
    ];
  },
  []
);

mongoose
  .connect('mongodb://localhost:27017/cafedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(async () => {
    const db = mongoose.connection;
    console.log('mongoose connected');
    await db.db
      .dropCollection('facilities')
      .then(() => console.info('Collection facilities dropped'))
      .catch((error) => console.error('Collection facilities error', error));
    await db.db
      .dropCollection('reviews')
      .then(() => console.info('Collection reviews dropped'))
      .catch((error) => console.error('Collection reviews error', error));
    await db.db
      .dropCollection('images')
      .then(() => console.info('Collection images dropped'))
      .catch((error) => console.error('Collection images error', error));
    await db.db
      .dropCollection('users')
      .then(() => console.info('Collection users dropped'))
      .catch((error) =>
        console.error('Collection users error:', error.codeName)
      );
  })
  .then(async () => {
    try {
      console.info('Fixtures started loading');
      await userModel.create(usersList);
      await facilityModel.create(facilitiesList);
      await imageModel.create(imagesList);
      for (const image of imagesList) {
        await imageService.incrementFacilityImagesNumber(image.facility)
      }
      await Promise.all(
        reviewsList.map(async (review) => {
          const result = await reviewService.hasUpdatedFacilityRatingWithNew(
            review
          );
          if (result) {
            return await reviewModel.create(review);
          } else {
            return result;
          }
        })
      );
      console.info('Fixtures were loaded');
    } catch (error) {
      console.error(error);
    }
  })
  .finally(() => {
    mongoose.disconnect();
  });
