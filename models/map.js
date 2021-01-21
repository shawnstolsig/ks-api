'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Map extends Model {
    static associate(models) {
      // define association here
    }
  };
  Map.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Map',
    tableName: 'maps',
    timestamps: false,
  });
  return Map;
};