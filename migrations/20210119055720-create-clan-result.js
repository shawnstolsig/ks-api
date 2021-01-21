'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clanResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.INTEGER
      },
      clanId: {
        type: Sequelize.INTEGER
      },
      battleId: {
        type: Sequelize.INTEGER
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clanResults');
  }
};