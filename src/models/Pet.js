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
    allowNull: true,
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
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Campos específicos de pet perdido (só preenchidos quando status = 'lost')
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateLost: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reward: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  // Campos do dono/responsável pelo cadastro
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

module.exports = Pet;
