const usersService = require('../services/usersOng.service');
const generateToken = require('../utils/generateToken');
require('dotenv').config();

const getOngs = async (req, res) => {
  try {
    const ongs = await usersService.getAllOngs();
    res.json({ ongs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOng = async (req, res) => {
  try {
    const ong = await usersService.getOngById(req.params.id);
    res.json({ ong });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createOng = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha, // Vindo do frontend
      telefone,
      celular,
      cnpj,
      cep,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      HorarioFunc1,
      HorarioFunc2,
      imagem,
    } = req.body;

    // Mapeamento De -> Para
    const ongData = {
      name: nome,
      email,
      password: String(senha || ""), // Garante que seja string para o Service
      phone: telefone,
      celular,
      cnpj,
      cep,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      horario_inicio: HorarioFunc1,
      horario_fim: HorarioFunc2,
      avatar: imagem,
    };

    const ong = await usersService.createOng(ongData);

    const ongObj = ong.toJSON ? ong.toJSON() : ong;
    if (ongObj.password) delete ongObj.password;

    if (!process.env.JWT_SECRET) {
      return res.status(201).json({ user: ongObj });
    }

    const token = generateToken({ id: ongObj.id, email: ongObj.email, role: 'ong' });

    res.status(201).json({ token, user: ongObj });
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

module.exports = { getOngs, getOng, createOng };