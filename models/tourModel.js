const mongoose = require('mongoose');
const slugify = require('slugify');

const UserModel = require('./userModel');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      unique: true,
      trim: true
      //validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: {
      type: String
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium, difficult'
      }
    },
    price: {
      type: Number,
      required: [true, 'Please provide price']
    },
    ratingsAverage: {
      type: Number,
      // required: [true, 'please provide rating'],
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on new document creation.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: {
      type: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now()
      // select: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// creating the indexes on most queried paramaters, to only examin the matched docs as per query
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});


// Virtual Property durationWeeks
tourSchema.virtual('durationWeeks').get(function() {
  return (this.duration / 7).toFixed(2);
});

// Virtual Property reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE:
// this document middleware runs only before .save and .create
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding user guide documents into tour
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => {
//     return await UserModel.findById(id);
//   });

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// this document middleware runs only after all pre middlewares are done.
tourSchema.post('save', function(doc, next) {
  console.log('post middleware: ', doc);
  next();
});

// Query MIDDLEWARE:
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  //console.log('post query middleware Docs: ', docs);
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// populating the guides
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
