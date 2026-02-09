const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    // aceita cpf OU email
    const { cpf, email, password } = req.body;

    const { token, user } = await authService.login({ cpf, email, password });

    // retorna token + user (sem senha)
    return res.status(200).json({ token, user });
  } catch (error) {
    // mensagem genérica por segurança
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { login, register };
