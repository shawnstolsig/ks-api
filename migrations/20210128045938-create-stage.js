'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stages', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      target: {
        type: Sequelize.STRING
      },
      lossCount: {
        type: Sequelize.INTEGER
      },
      targetPublicRating: {
        type: Sequelize.INTEGER
      },
      victoriesRequired: {
        type: Sequelize.INTEGER
      },
      targetLeague: {
        type: Sequelize.INTEGER
      },
      battles: {
        type: Sequelize.INTEGER
      },
      targetDivision: {
        type: Sequelize.INTEGER
      },
      targetDivisionRating: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      winCount: {
        type: Sequelize.INTEGER
      },
      clanResultId: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stages');
  }
};