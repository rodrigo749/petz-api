'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona coluna para o tipo MIME da imagem
    await queryInterface.addColumn('pets', 'imagemMimeType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Altera a coluna image de STRING para LONGBLOB
    await queryInterface.changeColumn('pets', 'image', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pets', 'imagemMimeType');
    
    // Reverte para STRING
    await queryInterface.changeColumn('pets', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
