'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClanResult extends Model {
    static associate({ Battle, Clan, PlayerResult, Stage }) {

      ClanResult.hasMany(PlayerResult, { foreignKey: 'clanResultId', as: 'players' });
      ClanResult.hasOne(Stage);

      ClanResult.belongsTo(Battle, {
        as: 'battle',
        foreignKey: 'battleId'
      })

      ClanResult.belongsTo(Clan, {
        as: 'clan',
        foreignKey: 'clanId'
      })

    }
  };
  ClanResult.init({
    // attributes
    division: DataTypes.INTEGER,
    divisionRating: DataTypes.INTEGER,
    league: DataTypes.INTEGER,
    ratingDelta: DataTypes.INTEGER,
    result: DataTypes.STRING,
    teamRating: DataTypes.STRING,

    // foreign keys
    battleId: DataTypes.STRING,
    clanId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ClanResult',
    tableName: 'clanResults',
    timestamps: false,
  });
  return ClanResult;
};