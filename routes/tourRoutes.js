const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/month-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route('/')
  .get(protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(protect, tourController.deleteTour);

router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
