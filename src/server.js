const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { testConnection } = require('./config/db');
const { syncDB } = require('./database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    await syncDB();

    app.listen(PORT, () => {
      console.log(`✅ Backend rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();