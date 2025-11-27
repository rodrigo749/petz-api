const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  species: {
    type: DataTypes.ENUM('dog', 'cat'),
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'adopted', 'lost'),
    defaultValue: 'available',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

module.exports = Pet;
