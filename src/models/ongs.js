const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Ong = sequelize.define(
  "Ong",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    nome: { type: DataTypes.STRING(120), allowNull: true },

    // 14 sem pontuação; se você quer aceitar com máscara, use 18
    cnpj: { type: DataTypes.STRING(14), allowNull: true, unique: true },

    email: { type: DataTypes.STRING(254), allowNull: true, unique: true },

    // 255 é ok (hash). Não guarde senha pura.
    senha: { type: DataTypes.STRING(255), allowNull: true },

    telefone: { type: DataTypes.STRING(15), allowNull: true },
    celular: { type: DataTypes.STRING(15), allowNull: true },

    cep: { type: DataTypes.STRING(8), allowNull: true },

    rua: { type: DataTypes.STRING(120), allowNull: true },
    numero: { type: DataTypes.STRING(10), allowNull: true },
    complemento: { type: DataTypes.STRING(120), allowNull: true },

    cidade: { type: DataTypes.STRING(60), allowNull: true },
    estado: { type: DataTypes.STRING(2), allowNull: true },

    // horários como texto por enquanto
    horarioFunc1: { type: DataTypes.STRING(50), allowNull: true },
    horarioFunc2: { type: DataTypes.STRING(50), allowNull: true },

    imagem: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "ongs",
    timestamps: true,
  }
);

module.exports = Ong;
