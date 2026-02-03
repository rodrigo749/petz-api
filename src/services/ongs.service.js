const { models } = require('../database');
const { hashPassword } = require('../utils/hashPassword');

const createOng = async (ongData) => {
  // validação básica de duplicidade por CNPJ e/ou email
  const existingByCnpj = await models.Ong.findOne({ where: { cnpj: ongData.cnpj } });
  if (existingByCnpj) {
    const err = new Error('CNPJ já cadastrado');
    err.statusCode = 409;
    throw err;
  }

  if (ongData.email) {
    const existingByEmail = await models.Ong.findOne({ where: { email: ongData.email } });
    if (existingByEmail) {
      const err = new Error('Email já cadastrado');
      err.statusCode = 409;
      throw err;
    }
  }

  // senha hash (se sua tabela ongs usa "senha" ou "password", ajusta no próximo passo)
  if (ongData.senha) {
    ongData.senha = hashPassword(ongData.senha);
  }

  return await models.Ong.create(ongData);
};

module.exports = { createOng };
