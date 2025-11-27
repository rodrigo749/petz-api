const petsService = require('../services/pets.service');

const getPets = async (req, res) => {
  try {
    const pets = await petsService.getAllPets();
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
    const pet = await petsService.createPet(req.body);
    res.status(201).json({ pet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await petsService.updatePet(req.params.id, req.body);
    res.json({ pet });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = { getPets, getPet, createPet, updatePet, deletePet };
