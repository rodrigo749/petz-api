const { models } = require('../database');

const getAllPets = async () => {
  const pets = await models.Pet.findAll();
  return pets.map(pet => ({
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    age: pet.age,
    description: pet.description,
    image: pet.image,
    status: pet.status,
    location: pet.location,
    dateLost: pet.dateLost,
    reward: pet.reward,
    userName: pet.userName,
    userType: pet.userType,
    userId: pet.userId,
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

  if (petData.status === 'lost') {
    allowedFields.location = petData.location;
    allowedFields.dateLost = petData.dateLost;
    allowedFields.reward = petData.reward;
  }

  const cleanData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
  );

  console.log("Dados limpos para salvar:", cleanData);

  const pet = await models.Pet.create(cleanData);

  console.log("Pet salvo no banco:", pet.toJSON());

  return pet;
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

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
