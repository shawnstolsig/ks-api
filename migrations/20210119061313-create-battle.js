'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('battles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mapId: {
        type: Sequelize.INTEGER
      },
      realmId: {
        type: Sequelize.INTEGER
      },
      finishedAt: {
        type: Sequelize.DATE
      },
      season: {
        type: Sequelize.INTEGER
      },
      arenaId: {
        type: Sequelize.INTEGER
      },
      clusterId: {
        type: Sequelize.INTEGER
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