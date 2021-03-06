'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {

    static associate({ClanResult, PlayerResult, Map, Realm}) {

      Battle.hasMany(ClanResult, {foreignKey: 'battleId', as: 'teams'});
      Battle.hasMany(PlayerResult, {foreignKey: 'battleId'});

      Battle.belongsTo(Map, {
        as: 'map',
        foreignKey: 'mapId'
      })
      Battle.belongsTo(Realm, {
        as: 'realm',
        foreignKey: 'realmId',
      })
    }

  };
  Battle.init({
    // attributes
    arenaId: DataTypes.INTEGER,
    clusterId: DataTypes.INTEGER,
    season: DataTypes.INTEGER,
    finishedAt: DataTypes.DATE,
    winMethod: DataTypes.STRING,

    // foreign keys
    mapId: DataTypes.STRING,
    realmId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Battle',
    tableName: 'battles',
  });
  return Battle;
};