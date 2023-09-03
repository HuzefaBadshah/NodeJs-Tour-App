const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Further HELMET configuration for Security Policy (CSP) of Leaflet
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org', 'https://js.stripe.com/v3/'];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/'
];
const connectSrcUrls = [
      'https://unpkg.com', 
      'https://tile.openstreetmap.org'
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

//Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // using path module so that we need not to worry about the slashes

// Set security HTTP headers

app.use(helmet());
// necessary configurations for leaflet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls, 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com']
    }
  })
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // limiting payload not more than 10 kilo bytes

// Reading data from a form
// the way form sends data to server is called urlencoded
// we need a middleware to parse data from urlencoded form
app.use(express.urlencoded({extended: true, limit: '10kb'}));

// Parse data from cookie
app.use(cookieParser());

// Data Sanitization for req.body, req.query and req.params against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// this middleware with protect from any malicious HTML code from user
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// to compress received responses
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  console.log('Hello from the test middleware 👋');
  console.log('cookies: ', req.cookies);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

// template routes
app.use('/', viewRouter);

// API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', function(req, res, next) {
  next(
    new AppError(
      `*************${req.originalUrl}*************   is not found on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
