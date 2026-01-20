const { sequelize } = require('../src/config/db');

const columnsToAdd = [
  { name: 'celular', sql: "VARCHAR(50) NULL" },
  { name: 'cnpj', sql: "VARCHAR(50) NULL" },
  { name: 'cep', sql: "VARCHAR(20) NULL" },
  { name: 'rua', sql: "VARCHAR(255) NULL" },
  { name: 'numero', sql: "VARCHAR(50) NULL" },
  { name: 'complemento', sql: "VARCHAR(255) NULL" },
  { name: 'cidade', sql: "VARCHAR(255) NULL" },
  { name: 'estado', sql: "VARCHAR(10) NULL" },
  { name: 'horario_inicio', sql: "VARCHAR(20) NULL" },
  { name: 'horario_fim', sql: "VARCHAR(20) NULL" },
];

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // get existing columns
    const [results] = await sequelize.query("SHOW COLUMNS FROM users");
    const existing = results.map(r => r.Field);

    for (const col of columnsToAdd) {
      if (!existing.includes(col.name)) {
        const sql = `ALTER TABLE users ADD COLUMN ${col.name} ${col.sql}`;
        console.log('Executing:', sql);
        await sequelize.query(sql);
      } else {
        console.log('Column exists:', col.name);
      }
    }

    // ensure avatar is TEXT
    if (existing.includes('avatar')) {
      console.log('Altering avatar to TEXT if needed');
      await sequelize.query("ALTER TABLE users MODIFY avatar TEXT NULL");
    }

    console.log('Migrations complete');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit(0);
  }
};

run();
