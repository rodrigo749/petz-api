const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 20000,
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco OK');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = { sequelize, testConnection }; 