module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename users_usuario -> usuarios
    const tableNames = await queryInterface.showAllTables();

    if (tableNames.includes('users_usuario')) {
      await queryInterface.renameTable('users_usuario', 'usuarios');
    }

    // Rename users -> ongs (assuming users table was used for ongs)
    if (tableNames.includes('users')) {
      // Only rename if 'ongs' doesn't already exist to avoid conflict
      if (!tableNames.includes('ongs')) {
        await queryInterface.renameTable('users', 'ongs');
      }
    }

    // Drop 'onges' if it exists (typo table)
    if (tableNames.includes('onges')) {
      await queryInterface.dropTable('onges');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableNames = await queryInterface.showAllTables();

    if (tableNames.includes('usuarios')) {
      await queryInterface.renameTable('usuarios', 'users_usuario');
    }

    if (tableNames.includes('ongs')) {
      // Revert back to 'users' only if it doesn't exist
      if (!tableNames.includes('users')) {
        await queryInterface.renameTable('ongs', 'users');
      }
    }

    if (tableNames.includes('onges')) {
      // Nothing to do to restore a dropped typo table
    }
  }
};
