require('dotenv').config();

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha e-mail e senha." });
    }

    const adminEmail = 'admin@petz.com'
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const adminUser = {
        id: 1,
        nome: "Administrador",
        email: adminEmail,
        tipo: "admin",
        imagem: "",
      };

      return res.status(200).json({ user: adminUser });
    } else {
      return res.status(401).json({ error: "E-mail ou senha do administrador incorretos." });
    }
  } catch (error) {
    console.error("Erro ao autenticar administrador:", error.message);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

module.exports = { adminLogin };