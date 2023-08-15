const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
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

  if(!tourWtihReviews) {
    return next(new AppError('There is no tour with that name', 404));
  }

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

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
});

exports.updateUserData = catchAsync(async(req, res, next) => {
  console.log('update User Data: ', req.body);
  const {name, email} = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {name, email}, {
    new: true,
    runValidators: true
  });
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
})