'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clan extends Model {
    static associate({ PlayerResult }) {
      Clan.hasMany(PlayerResult, {
        foreignKey: 'clanId'
      });
    }
  };
  Clan.init({
    name: DataTypes.STRING,
    tag: DataTypes.STRING,
    realmId: DataTypes.INTEGER,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clan',
    tableName: 'clans',
    timestamps: false,
  });
  return Clan;
};