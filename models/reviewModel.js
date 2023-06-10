const mongoose = require('mongoose');

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
  this.populate({
    path: 'tour',
    select: 'name -guides'
  }).populate({
    path: 'user',
    select: 'name photo'
  });
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
