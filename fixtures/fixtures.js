const imageFileNames = require('./helpers/imageFilenames.json');
const createUsersByNumber = require('./helpers/users');
const createFacilities = require('./helpers/facilities');
const createFacilityImages = require('./helpers/images');
const createFacilityReviews = require('./helpers/reviews');

const USERS_NUMBER = 3;
const FACILITY_IMAGES_MAX_NUMBER = 20;
const FACILITY_REVIEWS_MAX_NUMBER = 5;

const usersList = createUsersByNumber(USERS_NUMBER);
const facilitiesList = createFacilities(usersList, imageFileNames.exterior);
const imagesList = facilitiesList.reduce((acc, { _id }) => {
  return [
    ...acc,
    ...createFacilityImages(
      _id,
      usersList,
      imageFileNames.interior,
      FACILITY_IMAGES_MAX_NUMBER
    )
  ];
}, []);
const reviewsList = facilitiesList.reduce((acc, { _id }) => {
  return [
    ...acc,
    ...createFacilityReviews(_id, usersList, FACILITY_REVIEWS_MAX_NUMBER)
  ];
}, []);
