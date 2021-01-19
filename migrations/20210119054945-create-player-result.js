'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('playerResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shipId: {
        type: Sequelize.INTEGER
      },
      clanId: {
        type: Sequelize.INTEGER
      },
      playerId: {
        type: Sequelize.INTEGER
      },
      clanResultId: {
        type: Sequelize.INTEGER
      },
      battleId: {
        type: Sequelize.INTEGER
      },
      survived: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('playerResults');
  }
};