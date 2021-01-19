'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      // define association here
    }
  };
  Player.init({
    name: DataTypes.STRING,
    clanId: DataTypes.INTEGER,
    realmId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Player',
    tableName: 'players',
  });
  return Player;
};