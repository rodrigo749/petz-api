const http = require('http');

const postData = JSON.stringify({
  nome: 'ONG HTTP Teste',
  email: 'onghttptest@example.com',
  senha: 'Teste1234',
  telefone: '(31) 1234-5678',
  celular: '(31) 91234-5678',
  cnpj: '00.000.000/0000-00',
  cep: '00000-000',
  rua: 'Rua HTTP',
  numero: '50',
  complemento: 'Sala HTTP',
  cidade: 'BH',
  estado: 'MG',
  HorarioFunc1: '09:00',
  HorarioFunc2: '18:00',
  imagem: ''
});

function doPost() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/ongs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function doGet() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/ongs', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

const fs = require('fs');

(async () => {
  try {
    const post = await doPost();
    const get = await doGet();

    const out = {
      post,
      get,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(__dirname + '/test_output.json', JSON.stringify(out, null, 2));
    // Also print a short message so human-run terminals show something
    console.log('Test finished, output written to scripts/test_output.json');
  } catch (err) {
    const out = { error: String(err), timestamp: new Date().toISOString() };
    fs.writeFileSync(__dirname + '/test_output.json', JSON.stringify(out, null, 2));
    console.error('Test failed, details written to scripts/test_output.json');
  }
})();
