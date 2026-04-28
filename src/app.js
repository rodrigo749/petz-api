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
  'https://desabandonefocinhos-front.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const allowedOriginsFromEnv = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allows tools like curl/Postman or same-origin requests with no Origin header.
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      allowedOriginsFromEnv.includes(origin) ||
      /^https:\/\/desabandonefocinhos-front(-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

    if (isAllowed) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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