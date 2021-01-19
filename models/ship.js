'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Ship.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    tier: DataTypes.INTEGER,
    classId: DataTypes.INTEGER,
    nationId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Ship',
    tableName: 'ships',
  });
  return Ship;
};