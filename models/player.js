'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate({ PlayerResult }) {
      Player.hasMany(PlayerResult, {
        foreignKey: 'playerId'
      })
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
    timestamps: false,
  });
  return Player;
};