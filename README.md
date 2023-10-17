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

- Experience the power of server-side rendering with Pug templates for a seamless user interface.
- Witness efficient data storage and retrieval powered by MongoDB, ensuring smooth tour management.

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

## API Documentation

For detailed API documentation and usage examples, please refer to our [API Documentation](https://documenter.getpostman.com/view/2647693/2s9YJW5R12).

