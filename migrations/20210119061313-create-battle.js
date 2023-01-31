'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('battles', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      mapId: {
        type: Sequelize.BIGINT
      },
      realmId: {
        type: Sequelize.BIGINT
      },
      finishedAt: {
        type: Sequelize.DATE
      },
      season: {
        type: Sequelize.INTEGER
      },
      winMethod: {
        type: Sequelize.STRING
      },
      arenaId: {
        type: Sequelize.BIGINT
      },
      clusterId: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('battles');
  }
};
