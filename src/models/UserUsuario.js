const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// 1. MUDANÇA: Nomeamos como UserUsuario para combinar com seus arquivos
const UserUsuario = sequelize.define('UserUsuario', { 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: { isEmail: true },
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'usuario',
  },
}, {
  // 2. MUDANÇA: Nome da tabela no banco de dados
  tableName: 'users_usuario', 
  timestamps: true,
});

// 3. MUDANÇA: Exportamos UserUsuario
module.exports = UserUsuario;