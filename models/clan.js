'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clan extends Model {
    static associate({ ClanResult, Player, PlayerResult, Realm }) {

      Clan.hasMany(ClanResult, { foreignKey: 'clanId' });
      Clan.hasMany(Player, { foreignKey: 'clanId' });
      Clan.hasMany(PlayerResult, { foreignKey: 'clanId' });

      Clan.belongsTo(Realm, {
        as: 'realm',
        foreignKey: 'realmId',
      })

    }
  };
  Clan.init({
    // attributes
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    isDisbanded: DataTypes.BOOLEAN,
    memberCount: DataTypes.INTEGER,
    tag: DataTypes.STRING,

    // foreign keys
    realmId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Clan',
    tableName: 'clans',
    timestamps: false,
  });
  return Clan;
};