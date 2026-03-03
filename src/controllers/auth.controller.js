const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    console.log("--- NOVA TENTATIVA DE ACESSO ---");
    console.log("Dados recebidos:", req.body);

    const { cpf, email, password } = req.body;
    const { token, user } = await authService.login({ cpf, email, password });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.register(userData);

    res.status(201).json({ user });
  } catch (error) {
    console.error('Erro no registro:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login, register };