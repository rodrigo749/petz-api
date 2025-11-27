const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const petsRoutes = require('./routes/pets.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pets', petsRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
