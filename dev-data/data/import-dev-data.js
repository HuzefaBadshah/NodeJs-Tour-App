const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: `${__dirname}/../../config.env` });

const app = require('./../../app');

console.log('process.env: ', process.env);
console.log('dirname: ', __dirname);
process.env.PORT = 4000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('connections: ', con.connections);
    console.log('DB connection successfull!');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

async function importData() {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false}); // password for all these users is test1234
    await Review.create(reviews);
    console.log('Data loaded successfully!');
    process.exit();
  } catch (error) {
    console.log('importData error: ', error);
  }
}

async function deleteData() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.log('deleteData error: ', error);
  }
}

console.log('process.argv: ', process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// can be included into package.json if throws error for new ecmascript features
// "engines": {
//   "node": ">17.0.0"
// }
