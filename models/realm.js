'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Realm extends Model {
    static associate(models) {
      // define association here
    }
  };
  Realm.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Realm',
    tableName: 'realms',
    timestamps: false,
  });
  return Realm;
};