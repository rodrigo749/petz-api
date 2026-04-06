const { sequelize } = require('../src/config/db');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Verifica colunas existentes na tabela pets
    const [results] = await sequelize.query("SHOW COLUMNS FROM pets");
    const existing = results.map(r => r.Field);

    // Adiciona coluna imagemMimeType se não existir
    if (!existing.includes('imagemMimeType')) {
      console.log('Adicionando coluna imagemMimeType...');
      await sequelize.query("ALTER TABLE pets ADD COLUMN imagemMimeType VARCHAR(100) NULL");
      console.log('Coluna imagemMimeType adicionada!');
    } else {
      console.log('Coluna imagemMimeType já existe');
    }

    // Altera coluna image para LONGBLOB
    console.log('Alterando coluna image para LONGBLOB...');
    await sequelize.query("ALTER TABLE pets MODIFY COLUMN image LONGBLOB NULL");
    console.log('Coluna image alterada para LONGBLOB!');

    console.log('Migration concluída com sucesso!');
  } catch (err) {
    console.error('Erro na migration:', err);
  } finally {
    process.exit(0);
  }
};

run();
