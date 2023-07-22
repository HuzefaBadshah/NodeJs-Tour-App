const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please provide a review']
    },
    rating: {
      type: Number,
      // default: 3,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Query Middleware
// populating the guides
reviewSchema.pre(/^find/, function() {
  // this.populate({
  //   path: 'tour',
  //   select: 'name -guides'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
});

// Static methods, that will be called on models only
reviewSchema.statics.calAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group: {
        _id: '$tour',
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ]);
  console.log('stats: ', stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

// Document middleware

reviewSchema.post('save', function() {
  // here this points to current review doc
  // here this.constructor will point the model from which this document was created
  // We used post middleware, coz the documents will be saved till then and we can run calAverageRatings to fetch all docs from database..
  // post middleware doesn't have next in argument
  this.constructor.calAverageRatings(this.tour);
});

// findByIdAndUpdate is shorthand for findOneAndUpdate
// findByIdAndDelete is shorthand for findOneAndDelete

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
