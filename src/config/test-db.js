const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'centerbeam.proxy.rlwy.net',
  port: 24820,
  user: 'root',
  password: 'kERgueemyVipuuvgvojkxfOVhKRPgSuR',
  database: 'railway',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  console.log('Conectado com sucesso!');
  connection.end();
}); 