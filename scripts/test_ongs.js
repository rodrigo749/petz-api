(async () => {
  try {
    const payload = {
      nome: 'ONG Script Teste',
      email: 'ongscript@example.com',
      senha: 'Teste1234',
      telefone: '(31) 1234-5678',
      celular: '(31) 91234-5678',
      cnpj: '00.000.000/0000-00',
      cep: '00000-000',
      rua: 'Rua Script',
      numero: '99',
      complemento: 'Sala Script',
      cidade: 'BH',
      estado: 'MG',
      HorarioFunc1: '09:00',
      HorarioFunc2: '18:00',
      imagem: ''
      
    };

    const postRes = await fetch('http://localhost:3000/api/ongs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('POST status:', postRes.status);
    const postText = await postRes.text();
    console.log('POST body:', postText);

    const getRes = await fetch('http://localhost:3000/api/ongs');
    console.log('GET status:', getRes.status);
    const getJson = await getRes.text();
    console.log('GET body:', getJson);
  } catch (err) {
    console.error('Error during test:', err);
  }
})();
