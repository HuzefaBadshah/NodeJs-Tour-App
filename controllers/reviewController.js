const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  // Perfect usecase to use route middleware and make createOne generic
  // If not in body then default to:
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReview = catchAsync(async function(req, res, next) {
  let tourId = req.params.tourId;
  let filter = {};
  if (tourId) filter = { tour: tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
exports.getReview = getOne(Review);
