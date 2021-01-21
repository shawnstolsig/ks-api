'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nation extends Model {
    static associate({ Ship }) {
      Nation.hasMany(Ship, {
        foreignKey: 'nationId'
      })
    }
  };
  Nation.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nation',
    tableName: 'nations',
    timestamps: false,
  });
  return Nation;
};