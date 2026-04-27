const petsService = require('../services/pets.service');

const serializePet = (pet) => ({
  ...pet,
  image: undefined,
  hasImage: pet.image !== null && pet.image !== undefined,
});

const getPets = async (req, res) => {
  try {
    const { status } = req.query;
    const pets = await petsService.getAllPets(status);
    res.json({ pets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPet = async (req, res) => {
  try {
    const pet = await petsService.getPetById(req.params.id);
    res.json({ pet });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createPet = async (req, res) => {
  try {
    console.log('Creating pet with data:', req.body);
    
    // Adiciona imagem como BLOB se enviada
    const petData = { ...req.body };
    if (req.file) {
      petData.image = req.file.buffer;
      petData.imagemMimeType = req.file.mimetype;
      console.log('Imagem recebida:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    }
    
    const pet = await petsService.createPet(petData);
    console.log('Pet created:', pet.id);
    res.status(201).json({ 
      pet: serializePet(pet)
    });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ error: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    // Adiciona imagem como BLOB se enviada
    const petData = { ...req.body };
    if (req.file) {
      petData.image = req.file.buffer;
      petData.imagemMimeType = req.file.mimetype;
    }
    
    const pet = await petsService.updatePet(req.params.id, petData);
    res.json({ 
      pet: serializePet(pet)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPetImage = async (req, res) => {
  try {
    const pet = await petsService.getPetById(req.params.id);
    
    if (!pet.image) {
      return res.status(404).json({ error: 'Pet não possui imagem.' });
    }
    
    res.setHeader('Content-Type', pet.imagemMimeType || 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="pet-${pet.id}.jpg"`);
    res.send(pet.image);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    await petsService.deletePet(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPets, getPet, createPet, updatePet, deletePet, getPetImage };
