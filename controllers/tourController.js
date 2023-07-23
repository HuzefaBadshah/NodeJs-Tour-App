const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll
} = require('./handlerFactory');

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

exports.getAllTours = getAll(Tour);

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


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/46.647236,7.385527/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {distance, latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1;

  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }

  const tours = await Tour.find({
    startLocation: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
});