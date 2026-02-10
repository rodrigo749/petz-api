require('dotenv').config();
const cors = require('cors'); // <-- Faltava essa linha!
const app = require('./app');
const { testConnection, sequelize } = require('./config/db');
const { syncDB } = require('./database');

// Force 3000 se o .env não estiver lendo, para não bater com o Next.js (3000)
const PORT = 3000;

// Configuração correta do CORS
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3002"], // Permite frontend nas portas 3001 e 3002
  credentials: true
}));

const startServer = async () => {
  try {
    await testConnection();
    await syncDB();

    app.listen(PORT, () => {
      // Log modificado para você clicar no link e testar
      console.log(`✅ Backend rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();