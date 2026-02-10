const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    console.log("--- TENTATIVA DE LOGIN ---");
    console.log("1. Body recebido:", req.body); // Mostra o que chegou do front

    const { cpf, email, password } = req.body;

    // Chama o serviço
    const result = await authService.login({ cpf, email, password });
    
    console.log("2. Login sucesso para:", result.user.email);
    return res.status(200).json(result);

  } catch (error) {
    console.error("--- ERRO NO LOGIN ---");
    console.error("Mensagem de erro:", error.message);
    
    // Se for erro de banco de dados, vai aparecer aqui:
    if (error.original) {
        console.error("Erro SQL:", error.original); 
    }

    return res.status(401).json({ error: error.message || 'Erro na autenticação' });
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
