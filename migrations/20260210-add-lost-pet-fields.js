'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pets', 'gender', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'dateLost', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'reward', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('pets', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'userName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'userType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('pets', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pets', 'gender');
    await queryInterface.removeColumn('pets', 'location');
    await queryInterface.removeColumn('pets', 'dateLost');
    await queryInterface.removeColumn('pets', 'reward');
    await queryInterface.removeColumn('pets', 'image');
    await queryInterface.removeColumn('pets', 'userName');
    await queryInterface.removeColumn('pets', 'userType');
  }
};
