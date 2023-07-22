const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/month-plan/:year').get(restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), tourController.deleteTour);



module.exports = router;
