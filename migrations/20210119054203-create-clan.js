'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clans', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      isDisbanded: {
        type: Sequelize.BOOLEAN
      },
      tag: {
        type: Sequelize.STRING
      },
      memberCount: {
        type: Sequelize.INTEGER
      },
      realmId: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clans');
  }
};