const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async(req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    });
  });

exports.getTour = catchAsync(async(req, res, next) => {
const query = Tour.findOne({slug: req.params.slug});
const tourWtihReviews = await query.populate({path: 'reviews', fields: 'review rating user'});

    res.status(200).render('tour', {
      title: `${tourWtihReviews.name} Tour`,
      tour: tourWtihReviews
    });
  });

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).set(
    'Content-Security-Policy',
    "connect-src 'self' https://cdnjs.cloudflare.com"
).render('login');
});