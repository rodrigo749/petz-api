const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. Adicione o path para lidar com pastas
const usersRoutes = require('./routes/users.routes');
const petsRoutes = require('./routes/pets.routes');
const authRoutes = require('./routes/auth.routes');

const uploadsRoutes = require('./routes/uploads.routes'); // 2. Importe a nova rota de upload
const adminRoutes = require('./routes/admin.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Servir arquivos estáticos (Essencial para as fotos aparecerem no navegador)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Petz API is working!' });
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadsRoutes); // 4. Registre a rota de upload aqui
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;