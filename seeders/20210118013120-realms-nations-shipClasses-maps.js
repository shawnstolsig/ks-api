'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('nations', [
      { id: 1, name: 'Japan', abbreviation: 'IJN' },
      { id: 2, name: 'United States', abbreviation: 'USN' },
      { id: 3, name: 'Germany', abbreviation: 'KMS' },
      { id: 4, name: 'Russia', abbreviation: 'USSR' },
      { id: 5, name: 'United Kingdom', abbreviation: 'RN' },
      { id: 6, name: 'Italy', abbreviation: 'ITA' },
      { id: 7, name: 'France', abbreviation: 'FR' },
      { id: 8, name: 'European', abbreviation: 'EU' },
      { id: 9, name: 'Commonwealth', abbreviation: 'Commonwealth' },
      { id: 10, name: 'Pan-Asia', abbreviation: 'Pan Asia' },
      { id: 11, name: 'Pan-America', abbreviation: 'Pan America' },
      { id: 12, name: 'Netherlands', abbreviation: 'HNLMS' },
    ]);
    await queryInterface.bulkInsert('realms', [
      { id: 1, name: 'Asia', abbreviation: 'ASIA', domain: 'asia', wgRealm: 'sg' },
      { id: 2, name: 'Europe', abbreviation: 'EU', domain: 'eu', wgRealm: 'eu' },
      { id: 3, name: 'North America', abbreviation: 'NA', domain: 'com', wgRealm: 'us' },
      { id: 4, name: 'Russia', abbreviation: 'RU', domain: 'ru', wgRealm: 'ru' },
    ])
    await queryInterface.bulkInsert('shipClasses', [
      { id: 1, name: 'Destroyer', abbreviation: 'DD', wgName: 'Destroyer' },
      { id: 2, name: 'Cruiser', abbreviation: 'CA', wgName: 'Cruiser' },
      { id: 3, name: 'Battleship', abbreviation: 'BB', wgName: 'Battleship' },
      { id: 4, name: 'Aircraft Carrier', abbreviation: 'CV', wgName: 'AirCarrier' },
      { id: 5, name: 'Submarine', abbreviation: 'SS', wgName: 'Submarine' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('nations', null, {})
    await queryInterface.bulkDelete('realms', null, {})
    await queryInterface.bulkDelete('shipClasses', null, {})
  }
};
