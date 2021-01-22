'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClanResult extends Model {
    static associate({ Battle, Clan, PlayerResult }) {

      ClanResult.hasMany(PlayerResult, { foreignKey: 'clanResultId' });

      ClanResult.belongsTo(Battle, {
        as: 'teams',
        foreignKey: 'battleId'
      })

      ClanResult.belongsTo(Clan, {
        as: 'battles',
        foreignKey: 'clanId'
      })

      // TODO: Stage association here

    }
  };
  ClanResult.init({
    // attributes
    division: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    divisionRating: DataTypes.INTEGER,
    ratingDelta: DataTypes.INTEGER,
    result: DataTypes.STRING,
    teamRating: DataTypes.STRING,

    // foreign keys
    battleId: DataTypes.INTEGER,
    clanId: DataTypes.INTEGER,
    stageId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ClanResult',
    tableName: 'clanResults',
    timestamps: false,
  });
  return ClanResult;
};