require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    try {
      await prisma.$connect();
      console.log('Database connection has been established successfully.');
    } catch (dbError) {
      console.warn('Database connection failed on startup, server will continue:', dbError.message);
    }

    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();