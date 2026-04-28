const prisma = require('../config/prisma');

const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toRewardOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num.toFixed(2);
};

const mapPetResponse = (pet) => ({
  id: pet.id,
  name: pet.name,
  species: pet.species,
  breed: pet.breed,
  gender: pet.gender,
  age: pet.age,
  description: pet.description,
  hasImage: pet.image !== null && pet.image !== undefined,
  imagemMimeType: pet.imagemMimeType,
  status: pet.status,
  location: pet.location,
  dateLost: pet.dateLost,
  reward: pet.reward,
  userName: pet.userName,
  userType: pet.userType,
  userId: pet.userId,
  createdAt: pet.createdAt,
  updatedAt: pet.updatedAt,
});

const getAllPets = async (status) => {
  const where = status ? { status } : undefined;
  const pets = await prisma.pet.findMany({ where, orderBy: { id: 'desc' } });
  return pets.map(mapPetResponse);
};

const getPetById = async (id) => {
  const pet = await prisma.pet.findUnique({ where: { id: Number(id) } });
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
    age: toIntOrNull(petData.age),
    description: petData.description,
    gender: petData.gender,
    image: petData.image,
    imagemMimeType: petData.imagemMimeType,
    status: petData.status || 'available',
    userName: petData.userName,
    userType: petData.userType,
    userId: toIntOrNull(petData.userId),
  };

  if (petData.status === 'lost') {
    allowedFields.location = petData.location;
    allowedFields.dateLost = toDateOrNull(petData.dateLost);
    allowedFields.reward = toRewardOrNull(petData.reward);
  }

  const cleanData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
  );

  console.log("Dados limpos para salvar:", { ...cleanData, image: cleanData.image ? '[BLOB]' : null });

  const pet = await prisma.pet.create({ data: cleanData });

  console.log("Pet salvo no banco:", pet.id);

  return pet;
};

const updatePet = async (id, petData) => {
  const petId = Number(id);
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new Error('Pet not found');
  }
  
  // Se uma nova imagem foi enviada, atualiza
  const updateData = { ...petData };
  if (Object.prototype.hasOwnProperty.call(updateData, 'age')) {
    updateData.age = toIntOrNull(updateData.age);
  }
  if (Object.prototype.hasOwnProperty.call(updateData, 'userId')) {
    updateData.userId = toIntOrNull(updateData.userId);
  }
  if (Object.prototype.hasOwnProperty.call(updateData, 'dateLost')) {
    updateData.dateLost = toDateOrNull(updateData.dateLost);
  }
  if (Object.prototype.hasOwnProperty.call(updateData, 'reward')) {
    updateData.reward = toRewardOrNull(updateData.reward);
  }
  if (petData.image) {
    updateData.image = petData.image;
    updateData.imagemMimeType = petData.imagemMimeType;
  }

  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );
  
  return prisma.pet.update({
    where: { id: petId },
    data: filteredData,
  });
};

const deletePet = async (id) => {
  const petId = Number(id);
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new Error('Pet not found');
  }
  await prisma.pet.delete({ where: { id: petId } });
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};
