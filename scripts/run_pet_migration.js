const { sequelize } = require('../src/config/db');

const columnsToAdd = [
  { name: 'gender', sql: "VARCHAR(255) NULL" },
  { name: 'location', sql: "VARCHAR(255) NULL" },
  { name: 'dateLost', sql: "DATE NULL" },
  { name: 'reward', sql: "DECIMAL(10, 2) NULL DEFAULT 0" },
  { name: 'image', sql: "VARCHAR(255) NULL" },
  { name: 'userName', sql: "VARCHAR(255) NULL" },
  { name: 'userType', sql: "VARCHAR(255) NULL" },
  { name: 'userId', sql: "INT NULL" },
];

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // get existing columns
    const [results] = await sequelize.query("SHOW COLUMNS FROM pets");
    const existing = results.map(r => r.Field);

    for (const col of columnsToAdd) {
      if (!existing.includes(col.name)) {
        const sql = `ALTER TABLE pets ADD COLUMN ${col.name} ${col.sql}`;
        console.log('Executing:', sql);
        await sequelize.query(sql);
      } else {
        console.log('Column exists:', col.name);
        // Special case for userId: ensure it's nullable
        if (col.name === 'userId') {
          const alterSql = `ALTER TABLE pets MODIFY COLUMN userId INT NULL`;
          console.log('Ensuring userId is nullable:', alterSql);
          await sequelize.query(alterSql);
        }
      }
    }

    console.log('Pet migrations complete');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit(0);
  }
};

run();
