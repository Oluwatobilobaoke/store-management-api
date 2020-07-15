const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

// routes

const auth = require('./routes/auth');



const connectDatabase = require('./config/db.config');
const errorHandler = require('./middlewares/error');

// Connect to database
connectDatabase();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// logging middleware
if (process.env.NODE_ENV === 'development') {

}

// Sanitize data
app.use(mongoSanitize());

// Enable CORS
app.use(cors());

// mount routers

app.use('/api/v1/auth', auth);






// handle error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running on ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

// Handle unhandle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});