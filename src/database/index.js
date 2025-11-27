// Load models and synchronize database
const { sequelize } = require('../config/db');
const fs = require('fs');
const path = require('path');

// Load all models
const models = {};
const modelsPath = path.join(__dirname, '../models');

fs.readdirSync(modelsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const model = require(path.join(modelsPath, file));
    models[model.name] = model;
  }
});

// Associate models if associations are defined
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database
const syncDB = async () => {
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = { models, syncDB };
