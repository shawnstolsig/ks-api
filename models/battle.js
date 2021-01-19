'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Battle extends Model {
    static associate(models) {
      // define association here
    }
  };
  Battle.init({
    mapId: DataTypes.INTEGER,
    realmId: DataTypes.INTEGER,
    finishedAt: DataTypes.DATE,
    season: DataTypes.INTEGER,
    arenaId: DataTypes.INTEGER,
    clusterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Battle',
    tableName: 'battles',
  });
  return Battle;
};