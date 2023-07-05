const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  createReview,
  getAllReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(deleteReview)
  .patch(updateReview);

module.exports = router;
