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
        type: Sequelize.STRING
      },
      clanId: {
        type: Sequelize.STRING
      },
      playerId: {
        type: Sequelize.STRING
      },
      clanResultId: {
        type: Sequelize.STRING
      },
      battleId: {
        type: Sequelize.STRING
      },
      survived: {
        type: Sequelize.BOOLEAN
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('playerResults');
  }
};