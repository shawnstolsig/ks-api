'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('battles', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      mapId: {
        type: Sequelize.STRING
      },
      realmId: {
        type: Sequelize.STRING
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
        type: Sequelize.STRING
      },
      clusterId: {
        type: Sequelize.STRING
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