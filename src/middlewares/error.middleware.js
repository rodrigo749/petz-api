const { sendError } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error('✗ Erro capturado:', {
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    path: req.path,
    method: req.method,
  });

  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_ERROR';

  // Tratamento específico para erros de validação do Zod
  if (err.name === 'ZodError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    const message = err.errors[0]?.message || 'Erro de validação';
    return sendError(res, message, errorCode, statusCode);
  }

  // Tratamento específico para erros de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    errorCode = 'FILE_TOO_LARGE';
    return sendError(res, 'Arquivo muito grande. Máximo 5MB.', errorCode, statusCode);
  }

  if (err.message === 'Unexpected field') {
    statusCode = 400;
    errorCode = 'INVALID_FIELD';
    return sendError(res, 'Campo de arquivo inválido.', errorCode, statusCode);
  }

  sendError(res, err.message, errorCode, statusCode);
};

module.exports = errorMiddleware;
