const { models } = require('../database');

const getAllPets = async () => {
  const pets = await models.Pet.findAll();
  return pets.map(pet => ({
    id: pet.id,
    nome: pet.name,
    raca: pet.breed,
    genero: pet.gender,
    idade: pet.age,
    descricao: pet.description,
    imagem: pet.image,
    status: pet.status,
    local: pet.location,
    data: pet.dateLost,
    recompensa: pet.reward,
    usuarioId: pet.userId, // assuming there's userId
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
  return await models.Pet.create(petData);
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
