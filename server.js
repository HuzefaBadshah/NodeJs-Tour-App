const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 🔥, SHUTTING DOWN..');
  server.close(() => {
    process.exit(1);
  });
});


process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION 🔥, SHUTTING DOWN..');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

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
    // console.log('connections: ', con.connections);
    console.log('DB connection successfull!');
  })
.catch(err => {
  console.log('mongo connection error: ', err);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


// can be included into package.json if throws error for new ecmascript features
// "engines": {
//   "node": ">17.0.0"
// }
