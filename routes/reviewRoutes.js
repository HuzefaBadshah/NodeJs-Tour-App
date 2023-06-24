const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  createReview,
  getAllReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReview).post(protect, restrictTo('user'), createReview);

module.exports = router;
