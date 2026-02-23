const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    console.log("--- NOVA TENTATIVA DE ACESSO ---");
    console.log("Dados recebidos:", req.body);

    const { cpf, email, password, cnpj } = req.body;

    const result = await authService.login({ cpf, email, password, cnpj });

    console.log(`Login realizado com sucesso! ID: ${result.user.id}`);

    return res.status(200).json(result);

  } catch (error) {
    console.error("Erro no processo de login:", error.message);
    
    if (error.original) {
      console.error("Detalhes do erro no Banco de Dados:", error.original.message);
    }

    return res.status(401).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Erro no registro:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { login, register };