'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clan extends Model {
    static associate(models) {
      // define association here
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
  });
  return Clan;
};