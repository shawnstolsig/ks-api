'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clanResults', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.BIGINT
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
      clanId: {
        type: Sequelize.BIGINT
      },
      battleId: {
        type: Sequelize.BIGINT
      },
      isPrivate: {
        type: Sequelize.BOOLEAN
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clanResults');
  }
};
