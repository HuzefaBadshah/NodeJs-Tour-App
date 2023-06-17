const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  createReview,
  getAllReview
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getAllReview);

module.exports = router;
