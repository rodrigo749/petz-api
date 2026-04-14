const uploadImage = async (file) => {
  if (!file) {
    throw new Error('Arquivo não fornecido');
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(file.mimetype)) {
    throw new Error('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Máximo 5MB.');
  }

  // Retorna o buffer da imagem (será armazenado como BLOB no banco)
  console.log('✓ Sucesso em validar imagem');
  return file.buffer;
};

module.exports = { uploadImage };