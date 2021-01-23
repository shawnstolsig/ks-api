'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ships', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      tier: {
        type: Sequelize.INTEGER
      },
      shipClassId: {
        type: Sequelize.STRING
      },
      nationId: {
        type: Sequelize.STRING
      },
      abbreviation: {
        type: Sequelize.STRING
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ships');
  }
};