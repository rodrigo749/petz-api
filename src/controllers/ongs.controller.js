const ongsService = require('../services/ongs.service');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { models } = require('../database'); // ✅ forma correta
require('dotenv').config();

/**
 * LISTAR ONGS
 */
const getOngs = async (req, res) => {
  try {
    const ongs = await ongsService.getAllOngs();
    return res.json({ ongs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * BUSCAR ONG POR ID
 */
const getOng = async (req, res) => {
  try {
    const ong = await ongsService.getOngById(req.params.id);
    return res.json({ ong });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * CADASTRO DE ONG
 */
const createOng = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      telefone,
      celular,
      cnpj,
      cep,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      horarioFunc1,
      horarioFunc2,
      HorarioFunc1,
      HorarioFunc2,
      imagem,
    } = req.body;

    const ongData = {
      nome,
      email,
      senha,
      telefone,
      celular,
      cnpj: (cnpj || '').replace(/\D/g, '').slice(0, 14),
      cep: (cep || '').replace(/\D/g, '').slice(0, 8),
      rua,
      numero,
      complemento,
      cidade,
      estado,
      // ✅ aceita H maiúsculo ou minúsculo
      horarioFunc1: horarioFunc1 ?? HorarioFunc1 ?? null,
      horarioFunc2: horarioFunc2 ?? HorarioFunc2 ?? null,
      imagem,
    };

    const ong = await ongsService.createOng(ongData);

    const ongObj = ong.toJSON();
    delete ongObj.senha;

    if (!process.env.JWT_SECRET) {
      return res.status(201).json({ user: ongObj });
    }

    const token = generateToken({
      id: ongObj.id,
      email: ongObj.email,
      role: 'ong',
    });

    return res.status(201).json({ token, user: ongObj });
  } catch (error) {
    const status = error.statusCode || 400;
    return res.status(status).json({ message: error.message });
  }
};

/**
 * LOGIN DE ONG
 */
const loginOng = async (req, res) => {
  try {
    const { cnpj, senha } = req.body;

    const cnpjDigits = (cnpj || '').replace(/\D/g, '').slice(0, 14);

    const ong = await models.Ong.findOne({
      where: { cnpj: cnpjDigits },
    });

    if (!ong) {
      return res.status(401).json({ message: 'CNPJ ou senha incorretos' });
    }

    const senhaOk = await bcrypt.compare(senha, ong.senha);
    if (!senhaOk) {
      return res.status(401).json({ message: 'CNPJ ou senha incorretos' });
    }

    const ongObj = ong.toJSON();
    delete ongObj.senha;

    if (!process.env.JWT_SECRET) {
      return res.json({ user: ongObj });
    }

    const token = generateToken({
      id: ongObj.id,
      email: ongObj.email,
      role: 'ong',
    });

    return res.json({ token, user: ongObj });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

module.exports = {
  getOngs,
  getOng,
  createOng,
  loginOng,
};

