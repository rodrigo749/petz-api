const { models } = require('../database');

const getAllPets = async () => {
  const pets = await models.Pet.findAll();
  return pets.map(pet => ({
    id: pet.id,
    nome: pet.name,
    especie: pet.species,
    raca: pet.breed,
    genero: pet.gender,
    idade: pet.age,
    descricao: pet.description,
    imagem: pet.image,
    status: pet.status,
    local: pet.location,
    dataPerdido: pet.dateLost,
    recompensa: pet.reward,
    nomeUsuario: pet.userName,
    tipoUsuario: pet.userType,
    usuarioId: pet.userId,
  }));
};

const getPetById = async (id) => {
  const pet = await models.Pet.findByPk(id);
  if (!pet) {
    throw new Error('Pet not found');
  }
  return pet;
};

const createPet = async (petData) => {
  // Campos base válidos para qualquer tipo de pet
  const allowedFields = {
    name: petData.name,
    species: petData.species,
    breed: petData.breed,
    age: petData.age,
    description: petData.description,
    gender: petData.gender,
    image: petData.image,
    status: petData.status || 'available',
    userName: petData.userName,
    userType: petData.userType,
    userId: petData.userId,
  };

  // Campos exclusivos de pet perdido — só incluídos se status = 'lost'
  if (petData.status === 'lost') {
    allowedFields.location = petData.location;
    allowedFields.dateLost = petData.dateLost;
    allowedFields.reward = petData.reward;
  }

  // Remove chaves com valor undefined para não enviar colunas desnecessárias
  const cleanData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
  );

  return await models.Pet.create(cleanData);
};

const updatePet = async (id, petData) => {
  const pet = await models.Pet.findByPk(id);
  if (!pet) {
    throw new Error('Pet not found');
  }
  await pet.update(petData);
  return pet;
};

const deletePet = async (id) => {
  const pet = await models.Pet.findByPk(id);
  if (!pet) {
    throw new Error('Pet not found');
  }
  await pet.destroy();
};

module.exports = { getAllPets, getPetById, createPet, updatePet, deletePet };
