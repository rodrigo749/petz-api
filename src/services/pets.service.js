const { models } = require('../database');

const getAllPets = async () => {
  return await models.Pet.findAll();
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
