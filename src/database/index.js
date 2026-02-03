// Load models and synchronize database (team-safe + supports mixed model formats)
const { sequelize } = require("../config/db");
const fs = require("fs");
const path = require("path");
const { DataTypes, Model } = require("sequelize");

// Load all models
const models = {};
const modelsPath = path.join(__dirname, "../models");

fs.readdirSync(modelsPath).forEach((file) => {
  if (!file.endsWith(".js")) return;

  const exported = require(path.join(modelsPath, file));

  try {
    // ✅ Case 1: factory function (sequelize, DataTypes) => model
    if (typeof exported === "function") {
      // If it's a Sequelize Model class, do NOT call it like a factory
      const isModelClass = exported.prototype instanceof Model;

      if (!isModelClass) {
        const model = exported(sequelize, DataTypes);
        models[model.name] = model;
        return;
      }
    }

    // ✅ Case 2: already defined model instance (sequelize.define(...))
    if (exported && exported.sequelize && exported.getTableName) {
      models[exported.name] = exported;
      return;
    }

    // ✅ Case 3: Sequelize model class (extends Model) — try init if provided
    // (only works if that class exposes an initModel method; otherwise skip safely)
    if (typeof exported === "function" && exported.prototype instanceof Model) {
      if (typeof exported.initModel === "function") {
        const model = exported.initModel(sequelize, DataTypes);
        models[model.name] = model;
      } else {
        console.warn(
          `[database] Model class in "${file}" was exported, but no initModel() found. Skipping.`
        );
      }
      return;
    }

    console.warn(
      `[database] Unrecognized model export in "${file}". Expected factory function or defined model. Skipping.`
    );
  } catch (err) {
    console.error(`[database] Failed loading model from "${file}":`, err);
  }
});

// Associate models if associations are defined
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  }
});

// Sync database
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true, force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = { models, syncDB };
