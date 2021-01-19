'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('nations', [
      { name: 'Japan', abbreviation: 'IJN', createdAt: new Date(), updatedAt: new Date() },
      { name: 'United States', abbreviation: 'USN', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Germany', abbreviation: 'KMS', createdAt: new Date(), updatedAt: new Date() },
      { name: 'United Kingdom', abbreviation: 'RN', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Russia', abbreviation: 'USSR', createdAt: new Date(), updatedAt: new Date() },
    ]);
    await queryInterface.bulkInsert('ships',[
      { name: 'Yamato', abbreviation: 'Yam', tier: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Des Moines', abbreviation: 'DM', tier: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Halland', abbreviation: 'Hal', tier: 10, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ships', null, {})
    await queryInterface.bulkDelete('nations', null, {})
  }
};
