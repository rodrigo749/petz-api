const { models, syncDB } = require('../src/database');

(async () => {
  try {
    await syncDB();
    const ongs = await models.User.findAll({ where: { role: 'ong' }, attributes: { exclude: ['password'] } });
    console.log('ONGs found:', JSON.stringify(ongs, null, 2));
  } catch (err) {
    console.error('Error listing ongs:', err);
  } finally {
    process.exit(0);
  }
})();
