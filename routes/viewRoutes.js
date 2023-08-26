const express = require('express');
const { getOverview, getTour, getLoginForm, getAccount, updateUserData, getMyBookedTours } = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

  // router.use(isLoggedIn); // since isLoggedIn and protect will do redundant operations
  
  router.get('/', isLoggedIn, getOverview);  
  router.get('/tour/:slug', isLoggedIn, getTour);
  router.get('/login', isLoggedIn, getLoginForm);
  router.get('/me', protect, getAccount);

  router.get(
    '/my-tours',
    createBookingCheckout,
    protect,
    getMyBookedTours
  );

  router.post('/submit-user-data', protect, updateUserData);

module.exports = router;