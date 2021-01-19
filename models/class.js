'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      // define association here
    }
  };
  Class.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
  });
  return Class;
};