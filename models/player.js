'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate({ Clan, PlayerResult, Realm }) {

      Player.hasMany(PlayerResult, { foreignKey: 'playerId' })

      Player.belongsTo(Clan, {
        as: 'clan',
        foreignKey: 'clanId'
      })

      Player.belongsTo(Realm, {
        as: 'realm',
        foreignKey: 'realmId',
      })


    }
  };
  Player.init({
    // attributes
    name: DataTypes.STRING,
    asOf: DataTypes.DATE,

    // foreign keys
    clanId: DataTypes.BIGINT,
    realmId: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Player',
    tableName: 'players',
    timestamps: false,
  });
  return Player;
};
