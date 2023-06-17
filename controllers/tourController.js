const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('No tour found with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  });

  // catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('No tour found with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  //await Tour.deleteOne({ _id: req.params.id });
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with this id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

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
