'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Map extends Model {
    static associate({ Battle }) {

      Map.hasMany(Battle, { foreignKey: 'mapId'})

    }
  };
  Map.init({
    // attributes
    image: DataTypes.STRING,
    name: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Map',
    tableName: 'maps',
    timestamps: false,
  });
  return Map;
};
