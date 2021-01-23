'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clanResults', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      division: {
        type: Sequelize.INTEGER
      },
      league: {
        type: Sequelize.INTEGER
      },
      teamRating: {
        type: Sequelize.STRING
      },
      ratingDelta: {
        type: Sequelize.INTEGER
      },
      result: {
        type: Sequelize.STRING
      },
      divisionRating: {
        type: Sequelize.INTEGER
      },
      stageId: {
        type: Sequelize.STRING
      },
      clanId: {
        type: Sequelize.STRING
      },
      battleId: {
        type: Sequelize.STRING
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clanResults');
  }
};