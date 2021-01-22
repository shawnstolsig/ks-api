'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {
    static associate({ ClanResult, PlayerResult, Map, Realm }) {

      Battle.hasMany(ClanResult, { foreignKey: 'battleId' });
      Battle.hasMany(PlayerResult, { foreignKey: 'battleId' });

      Battle.belongsTo(Map, {
        as: 'map',
        foreignKey: 'mapId'
      })
      Battle.belongsTo(Realm,{
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

    // foreign keys
    mapId: DataTypes.INTEGER,
    realmId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Battle',
    tableName: 'battles',
  });
  return Battle;
};