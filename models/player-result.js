'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerResult extends Model {
    static associate(models) {
      // define association here
    }
  };
  PlayerResult.init({
    shipId: DataTypes.INTEGER,
    clanId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    clanResultId: DataTypes.INTEGER,
    battleId: DataTypes.INTEGER,
    survived: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PlayerResult',
    tableName: 'playerResults',
  });
  return PlayerResult;
};