const express = require('express');
const cors = require('cors');

const bookRoutes = require('./routes/book.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const { globalExceptionHandler, handleUncaughtExceptions } = require('./middlewares/exceptions');

handleUncaughtExceptions();

const app = express();

// preflightContinue

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

app.use(express.json());

const API_BASE_PATH = process.env.API_BASE_PATH;

app.use(`${API_BASE_PATH}/books`, bookRoutes);
app.use(`${API_BASE_PATH}/users`, userRoutes);
app.use(`${API_BASE_PATH}/auth`, authRoutes);

app.use(globalExceptionHandler);

module.exports = app;