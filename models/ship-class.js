'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShipClass extends Model {
    static associate({ Ship }) {

      ShipClass.hasMany(Ship, { foreignKey: 'shipClassId' })

    }
  };
  ShipClass.init({
    // attributes
    abbreviation: DataTypes.STRING,
    name: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'ShipClass',
    tableName: 'shipClasses',
    timestamps: false,
  });
  return ShipClass;
};