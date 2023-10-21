# My Tourism Experience Showcase

## Overview

Welcome to My Tourism Experience Showcase, a portfolio application that demonstrates my expertise in Node.js, MongoDB database management, server-side rendering using the Pug template engine, and more. This application is designed to simulate a real-world tourism platform, offering a wide range of features to explore and enjoy.

## Features

### Explore Exciting Tours

- Browse through an extensive list of curated tours from various destinations.
- Get detailed information about each tour, including highlights, duration, and pricing.
- View captivating images of the destinations to ignite your wanderlust.

### Plan Your Adventure

- Easily book your preferred tours with a simple click.
- Customize your travel itinerary by selecting specific dates and options.
- Keep track of your booked tours and upcoming adventures.

### User-Friendly Account Management

- Create and manage your user account effortlessly.
- Update your personal information and preferences to enhance your travel experience.
- Change your password securely to keep your account safe.

### Showcase of Node.js and MongoDB Expertise

- Experience the power of server-side rendering with **Pug** templates for a seamless user interface.
- Witness efficient data storage and retrieval powered by MongoDB, ensuring smooth tour management.

## Data Model
![Natours Data Modelling image](https://github.com/HuzefaBadshah/NodeJs-Tour-App/blob/main/dev-data/data%20model%20img/Data%20Model.png)

## Installation

To explore the My Tourism Experience Showcase, follow these steps:

1. Clone this repository
2. Navigate to the project directory: `cd your-repo`
3. Install dependencies and build the client-side bundle by running:

```bash
npm run cleanInstall-build
```
## Getting Started

After the dependencies are installed and the bundle is built, you can start the application with nodemon by running:

```bash
npm run dev
```

## Login Credientials
1. **Users**: loulou@example.com/test1234
2. **Guide**: leo@example.com/test1234
3. **Lead Guide**: steve@example.com/test1234

### For Booking Tours Functionality
In order to use this functionality on your machine you need to create account on [stripe](https://dashboard.stripe.com/)
 #### Follow steps below:
 1. Create stripe account.
 2. Go to Developers > API keys.
 3. copy Publishable key and and paste in location: public/js/stripe.js
 4. copy Secret key and paste in the config.env under STRIPE_SECRET_KEY
    
### For Forgot Password Functionality
In order to get mails when you click on forgot password, mails get trapped in [Mailtrap](https://mailtrap.io/). Since we are not sending real time mails to users. Please create account on given mailtrap link and follow steps below:
  1. Click on add project and give any project name
  2. Add inbox and go into that inbox by click on it
  3. you should be able to click on "show credrentials" under "SMTP Settings"
  4. map you config.env as EMAIL_USERNAME: Username, EMAIL_PASSWORD: Password, EMAIL_HOST: Host, EMAIL_PORT: 25, EMAIL_FROM: hello@test.io

### Libraries used:
```js
    axios: On frontend for making api calls.
    bcryptjs: For hashing and comparing user passwords.
    compression: To compress received responses
    cookie-parser: To parse data from cookie
    dotenv: To configure path for config.env so that properties are available on process.env
    express: NodeJs framework
    express-mongo-sanitize: Data Sanitization for req.body, req.query and req.params against NoSQL query injection
    express-rate-limit: To limit no. of request from same API
    helmet: Set security HTTP headers
    hpp: To prevent parameter pollution
    html-to-text: Used along with nodemailer to parse html
    jsonwebtoken: To create and verify Json Web Tokens
    mongoose: To query mongo db
    morgan: HTTP request logger middleware for node.js
    multer: Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
    nodemailer: To be able to send mails in our case to mail trap,
    pug: Templating engine,
    sharp: to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions
    slugify: to transform strings
    stripe: The Stripe Node library provides convenient access to the Stripe API
    validator: Used for string validation
    xss-clean: To protect from any malicious HTML code from user
```
## Project Highlights

As part of this project, I have implemented several key features and components to enhance its functionality. Here's a brief overview of these concepts:

### Global Error Handling Middleware
Whenever next callback is called with any argument, global error handler is called which will manage development and production error handlings. This middleware is implemented at very last of app.js and implementation is in file errorController.js. The cases such as CastError, Validation failed, JsonWebTokenError, TokenExpiredError, etc are handled application wide.
This middleware will be responsible for handling operationl errors application wide such as:
1. Invalid Path accessed
2. Invalid user input
3. Failed to connect to a server
4. Failed to connect to a database
5. Request timeout, etc...

### Virtual Populate
In MongoDB, you can use the populate method to fill a field in a document with data from another collection. This is commonly referred to as "populating" a field, and it's often used to establish relationships between collections in a NoSQL database. When you want to populate a field in a document with data from another collection, you use a technique called "virtual population." This allows you to create a virtual reference to another collection without physically storing the referenced data in your document.
For this application I have chosen parent referencing for reviews collection. Each review document will have a reference id of its tour. The virtual field on tour schema is called **reviews**.
```js
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
```


### Nested Routes
Using advance feature of express like **mergeParams** we can implement nested routes. For example in this application we need to get/post a review as per tour id. For this case we can user tour routes in tour router and link its resources with review router:
**router.use('/:tourId/reviews', reviewRouter)**

### Router Middleware
A router middleware is triggered before actual controller function is hit.
For example: **router.get(protectMiddleware, restrictMiddleware, someControllerFunc)**

### Document Middlewares
Document middlewares such as pre/post save, which will run before document is been saved or after its saved. This will be present on every document of that schema.
Use cases:
1. Pre middleware is used to modify and encrypt password before user details is saved
2. Post middleware is used to calculate time taken by query to execute. Also this middleware will run after all pre doc. middlewares are done.

### Query Middleware
Similar to document middlewares, a query middleware is run before/after a query is triggered.
Example: 
```js
   userSchema.pre(/^find/, () => {}) 
```
This will run for all queries that will start with find.

### Instance methods
These methods are available to be used on all documents of a collection.
For Example:
```js
   someSchema.methods.createPasswordResetToken = () => {}
```

### Aggregation Middleware
This middleware will run before/after aggregation pipeline. For example:
```js tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
```

### Virtual Property
This is a property which won't be save in database by will be availabe to the user virtually on the fly.

### Static Methods
These methods will be called on Models only. For example:
```js
   reviewSchema.statics.calAverageRatings = () => {}
```

### Server-Side Rendering
Server-side rendering is exactly what it sounds like: rendering on the server. You'll create an HTML file with all of the content of the site and send it back to the user. The user will then get an fully rendered HTML page that contains all of the necessary information for them to see your site without having to wait for any JavaScript or CSS files to load.
In this application **pug** is used as **view engine**.

## API Documentation

For detailed API documentation and usage examples, please refer to our [API Documentation](https://documenter.getpostman.com/view/2647693/2s9YJW5R12).

