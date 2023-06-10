const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  createReview,
  getAllReview
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/createReview/:tourId', protect, restrictTo('user'), createReview);
router.get('/', getAllReview);

module.exports = router;
