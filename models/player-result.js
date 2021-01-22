'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerResult extends Model {
    static associate({ Battle, Clan, ClanResult, Player, Ship }) {
      PlayerResult.belongsTo(Battle, {
        as: 'battle',
        foreignKey: 'battleId',
      });
      PlayerResult.belongsTo(Clan, {
        as: 'clan',
        foreignKey: 'clanId',
      });
      PlayerResult.belongsTo(ClanResult, {
        as: 'clanResult',
        foreignKey: 'clanResultId',
      });
      PlayerResult.belongsTo(Player, {
        as: 'player',
        foreignKey: 'playerId'
      });
      PlayerResult.belongsTo(Ship, {
        as: 'ship',
        foreignKey: 'shipId'
      });
    }
  };
  PlayerResult.init({
    // attributes
    survived: DataTypes.BOOLEAN,

    // foreign keys
    battleId: DataTypes.INTEGER,
    clanId: DataTypes.INTEGER,
    clanResultId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    shipId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'PlayerResult',
    tableName: 'playerResults',
    timestamps: false,
  });
  return PlayerResult;
};