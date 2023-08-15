const express = require('express');
const userController = require('./../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  isLoggedOut
} = require('../controllers/authController');

const router = express.Router();



router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', isLoggedOut);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


// Only allow admin users to access the endpoints after this point.
router.use(restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
