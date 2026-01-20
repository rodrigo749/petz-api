const { models, syncDB } = require('../src/database');
const fs = require('fs');

(async () => {
  try {
    await syncDB();
    const ongs = await models.User.findAll({ where: { role: 'ong' }, attributes: { exclude: ['password'] } });
    const out = { ongs, timestamp: new Date().toISOString() };
    fs.writeFileSync(__dirname + '/list_output.json', JSON.stringify(out, null, 2));
    console.log('Wrote scripts/list_output.json');
  } catch (err) {
    fs.writeFileSync(__dirname + '/list_output.json', JSON.stringify({ error: String(err) }));
    console.error('Error written to scripts/list_output.json');
  } finally {
    process.exit(0);
  }
})();
