'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nation extends Model {
    static associate(models) {
      // define association here
    }
  };
  Nation.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nation',
    tableName: 'nations',
  });
  return Nation;
};