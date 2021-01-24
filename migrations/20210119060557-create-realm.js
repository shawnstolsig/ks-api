'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('realms', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      abbreviation: {
        type: Sequelize.STRING
      },
      domain: {
        type: Sequelize.STRING
      },
      wgRealm: {
        type: Sequelize.STRING
      }

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('realms');
  }
};