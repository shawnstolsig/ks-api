'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clans', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.BIGINT
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
        type: Sequelize.BIGINT
      },
      color: {
        type: Sequelize.STRING
      },
      asOf: {
        type: Sequelize.DATE
      }

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clans');
  }
};
