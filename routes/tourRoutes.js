const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/month-plan/:year').get(restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router.get('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getToursWithin);
// can also be achieved with query params: /tours-within?distance=233&center=-40,45&unit=mi

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
  .patch(protect, 
        restrictTo('admin', 'lead-guide'), 
        tourController.uploadTourImages, 
        tourController.resizeTourImages, 
        tourController.updateTour
        )
  .delete(protect, restrictTo('admin', 'lead-guide'), tourController.deleteTour);



module.exports = router;
