const express = require('express');
const userController = require('./../controllers/userController');
const {
  signup,
  login,
  forgotPassword
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);

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
