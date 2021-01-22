'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nation extends Model {
    static associate({ Ship }) {

      Nation.hasMany(Ship, { foreignKey: 'nationId' })

    }
  };
  Nation.init({
    // attributes
    abbreviation: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Nation',
    tableName: 'nations',
    timestamps: false,
  });
  return Nation;
};