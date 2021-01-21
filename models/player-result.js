'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerResult extends Model {
    static associate({ Battle, Clan, ClanResult, Player, Ship }) {
      PlayerResult.belongsTo(Battle, { as: 'battle' });
      PlayerResult.belongsTo(Clan, { as: 'clan' });
      PlayerResult.belongsTo(ClanResult, { as: 'clanResult' });
      PlayerResult.belongsTo(Player, { as: 'player' });
      PlayerResult.belongsTo(Ship, {as: 'ship' });
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