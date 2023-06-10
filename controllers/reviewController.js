const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = catchAsync(async function(req, res, next) {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async function(req, res, next) {
  console.log('createReview: ', req.user, req.params);
  const tourId = req.params.tourId;
  const review = await Review.create({
    ...req.body,
    user: req.user.id,
    tour: tourId
  });

  res.status(201).json({
    status: 'success',
    data: { review }
  });
});
