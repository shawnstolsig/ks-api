'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('passwords', {
      hash: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.UUID,
        unique: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Passwords');
  }
};
