'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar coluna para armazenar o MIME type da imagem
    await queryInterface.addColumn('usuarios', 'imagemMimeType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Alterar coluna imagem de STRING para LONGBLOB
    await queryInterface.changeColumn('usuarios', 'imagem', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'imagemMimeType');
    await queryInterface.changeColumn('usuarios', 'imagem', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
