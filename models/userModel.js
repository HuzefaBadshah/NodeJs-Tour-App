const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required field'] },
  email: {
    type: String,
    required: [true, 'Email is required field'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this here only works for CREATE and SAVE
      validator: function (passConfirm) {
        return passConfirm === this.password;
      },
      message: 'Confirmed Password should match Password above!'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Document middleware
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  // here passwordConfirm is required as an input but not actually required to be saved to database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

//INSTANCE method
// this method will be available on all documents of Users collection
userSchema.methods.correctPassword = async function (userPass) {
  return await bcrypt.compare(userPass, this.password); // make sure the order of arguments are correct here.
};

//INSTANCE method
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    let changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > jwtTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(`Original: ${resetToken}, Encrypted: ${this.passwordResetToken}`);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
