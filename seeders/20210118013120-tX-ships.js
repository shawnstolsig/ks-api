'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('nations', [
      { name: 'Japan', abbreviation: 'IJN' },
      { name: 'United States', abbreviation: 'USN' },
      { name: 'Germany', abbreviation: 'KMS' },
      { name: 'United Kingdom', abbreviation: 'RN' },
      { name: 'Russia', abbreviation: 'USSR' },
      { name: 'European', abbreviation: 'EU' },
    ]);
    await queryInterface.bulkInsert('shipClasses', [
      { name: 'Destroyer', abbreviation: 'DD' },
      { name: 'Cruiser', abbreviation: 'CA' },
      { name: 'Battleship', abbreviation: 'BB' },
      { name: 'Aircraft Carrier', abbreviation: 'CV' },
    ]);
    await queryInterface.bulkInsert('ships',[
      { name: 'Yamato', abbreviation: 'Yam', tier: 10 },
      { name: 'Des Moines', abbreviation: 'DM', tier: 10 },
      { name: 'Halland', abbreviation: 'Hal', tier: 10 },
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
    await queryInterface.bulkDelete('shipClasses', null, {})
    await queryInterface.bulkDelete('nations', null, {})
  }
};
