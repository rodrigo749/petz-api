const sendSuccess = (res, data, message = 'Sucesso', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'Erro', code = 'INTERNAL_ERROR', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
    },
  });
};

module.exports = { sendSuccess, sendError };