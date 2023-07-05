const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory');

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  //console.log('req.query: ', req.query);
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(3)
  //   .where('difficulty')
  //   .equals('easy');

  // let query = Tour.find(JSON.parse(queryStr));

  let features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort('-createdAt _id')
    .limit('-__v')
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = getOne(Tour, {
  path: 'reviews'
  //select: '<properties here>'
});

exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $lte: 4.7 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { numTours: 1 }
    },
    {
      $match: {
        _id: { $ne: 'EASY' }
      }
    }
  ]);

  const tours = await stats;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-03-01`),
          $lte: new Date(`${year}-10-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        toursName: { $push: '$name' }
        //tourSummary: { $push: '$summary' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        //to show this field or not
        _id: 0
      }
    },
    {
      $sort: {
        month: -1
      }
    }
  ]);

  const tours = await plan;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours
  });
});
