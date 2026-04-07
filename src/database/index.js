// Load models and synchronize database
const { sequelize } = require('../config/db');
const fs = require('fs');
const path = require('path');

// Load all models
const models = {};
const modelsPath = path.join(__dirname, '../models');

fs.readdirSync(modelsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const model = require(path.join(modelsPath, file));
    models[model.name] = model;
  }
});

// Associate models if associations are defined
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Função para verificar se uma tabela existe
const tableExists = async (tableName) => {
  try {
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      { replacements: [tableName] }
    );
    return results[0].count > 0;
  } catch (error) {
    return false;
  }
};

// Função para verificar se uma coluna existe
const columnExists = async (tableName, columnName) => {
  try {
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM information_schema.columns 
       WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
      { replacements: [tableName, columnName] }
    );
    return results[0].count > 0;
  } catch (error) {
    return false;
  }
};

// Função para obter o tipo atual de uma coluna
const getColumnType = async (tableName, columnName) => {
  try {
    const [results] = await sequelize.query(
      `SELECT DATA_TYPE, COLUMN_TYPE FROM information_schema.columns 
       WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
      { replacements: [tableName, columnName] }
    );
    if (results.length > 0) {
      return results[0].DATA_TYPE.toLowerCase();
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Executa migrações necessárias para garantir estrutura correta do banco
const runAutoMigrations = async () => {
  console.log('🔄 Verificando migrações necessárias...');

  try {
    // Migração para tabela 'pets'
    if (await tableExists('pets')) {
      // Verificar/adicionar coluna imagemMimeType
      if (!(await columnExists('pets', 'imagemMimeType'))) {
        console.log('  → Adicionando coluna imagemMimeType em pets...');
        await sequelize.query("ALTER TABLE pets ADD COLUMN imagemMimeType VARCHAR(100) NULL");
      }

      // Verificar/alterar coluna image para LONGBLOB
      const petsImageType = await getColumnType('pets', 'image');
      if (petsImageType && petsImageType !== 'longblob') {
        console.log('  → Alterando coluna image em pets para LONGBLOB...');
        await sequelize.query("ALTER TABLE pets MODIFY COLUMN image LONGBLOB NULL");
      }
    }

    // Migração para tabela 'usuarios'
    if (await tableExists('usuarios')) {
      // Verificar/adicionar coluna imagemMimeType
      if (!(await columnExists('usuarios', 'imagemMimeType'))) {
        console.log('  → Adicionando coluna imagemMimeType em usuarios...');
        await sequelize.query("ALTER TABLE usuarios ADD COLUMN imagemMimeType VARCHAR(100) NULL");
      }

      // Verificar/alterar coluna imagem para LONGBLOB
      const usuariosImagemType = await getColumnType('usuarios', 'imagem');
      if (usuariosImagemType && usuariosImagemType !== 'longblob') {
        console.log('  → Alterando coluna imagem em usuarios para LONGBLOB...');
        await sequelize.query("ALTER TABLE usuarios MODIFY COLUMN imagem LONGBLOB NULL");
      }
    }

    console.log('✅ Migrações verificadas/aplicadas com sucesso!');
  } catch (error) {
    console.error('⚠️ Erro ao executar migrações automáticas:', error.message);
    // Não interrompe a execução - o sync pode criar as tabelas corretamente
  }
};

// Sync database
const syncDB = async () => {
  try {
    // Primeiro executa migrações automáticas para ajustar colunas existentes
    await runAutoMigrations();
    
    // Depois sincroniza os modelos (cria tabelas/colunas novas)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = { models, syncDB };
