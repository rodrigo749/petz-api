require('dotenv').config();
const app = require('./app');
const { testConnection, sequelize } = require('./config/db');
const { syncDB } = require('./database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await syncDB();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
