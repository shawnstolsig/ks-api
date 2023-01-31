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
    arenaId: DataTypes.BIGINT,
    clusterId: DataTypes.BIGINT,
    season: DataTypes.INTEGER,
    finishedAt: DataTypes.DATE,
    winMethod: DataTypes.STRING,

    // foreign keys
    mapId: DataTypes.BIGINT,
    realmId: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Battle',
    tableName: 'battles',
  });
  return Battle;
};
