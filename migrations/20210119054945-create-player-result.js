'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('playerResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      shipId: {
        type: Sequelize.BIGINT
      },
      clanId: {
        type: Sequelize.BIGINT
      },
      playerId: {
        type: Sequelize.BIGINT
      },
      clanResultId: {
        type: Sequelize.BIGINT
      },
      battleId: {
        type: Sequelize.BIGINT
      },
      survived: {
        type: Sequelize.BOOLEAN
      },
      isPrivate: {
        type: Sequelize.BOOLEAN
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('playerResults');
  }
};
