'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClanResult extends Model {
    static associate({ PlayerResult }) {
      ClanResult.hasMany(PlayerResult, {
        foreignKey: 'clanResultId'
      });
    }
  };
  ClanResult.init({
    division: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    teamRating: DataTypes.STRING,
    ratingDelta: DataTypes.INTEGER,
    result: DataTypes.STRING,
    divisionRating: DataTypes.INTEGER,
    stageId: DataTypes.INTEGER,
    clanId: DataTypes.INTEGER,
    battleId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ClanResult',
    tableName: 'clanResults',
    timestamps: false,
  });
  return ClanResult;
};