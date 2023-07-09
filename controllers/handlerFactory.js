const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (req, res) => {
    //await Model.deleteOne({ _id: req.params.id });
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        document: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        document: doc
      }
    });
  });

exports.getOne = (Model, populateOpts) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    if (populateOpts) query.populate(populateOpts);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        document: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res) => {
    //console.log('req.query: ', req.query);
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(3)
    //   .where('difficulty')
    //   .equals('easy');

    // let query = Tour.find(JSON.parse(queryStr));

    // To allow for nested GET reviews on tour (hack)
    let tourId = req.params.tourId;
    let filter = {};
    if (tourId) filter = { tour: tourId };

    let features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort('-createdAt _id')
      .limit('-__v')
      .pagination();

    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: docs.length,
      data: {
        docs
      }
    });
  });
