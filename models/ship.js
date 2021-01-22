'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ship extends Model {
    static associate({ ShipClass, Nation, PlayerResult }) {

      Ship.hasMany(PlayerResult, { foreignKey: 'shipId' })

      Ship.belongsTo(ShipClass, {
        foreignKey: 'shipClassId',
        as: 'shipClass',
      })
      Ship.belongsTo(Nation,{
        foreignKey: 'nationId',
        as: 'nation'
      })

    }
  };
  Ship.init({
    // attributes
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    tier: DataTypes.INTEGER,

    // foreign keys
    shipClassId: DataTypes.INTEGER,
    nationId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Ship',
    tableName: 'ships',
    timestamps: false,
  });
  return Ship;
};