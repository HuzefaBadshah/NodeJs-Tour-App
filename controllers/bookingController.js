const Booking = require('../models/bookingsModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const { createOne, updateOne, deleteOne, getOne, getAll } = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.getCheckoutSession = catchAsync(async function(req, res, next) {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
          req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                quantity: 1,
                price_data: {
                  currency: 'inr',
                  unit_amount: tour.price,
                  product_data: {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                  },
                },
              }
        ],
        mode: 'payment',
      });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
      });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = createOne(Booking);

exports.updateBooking = updateOne(Booking);

exports.deleteBooking = deleteOne(Booking);

exports.getBooking = getOne(Booking);

exports.getAllBookings = getAll(Booking);