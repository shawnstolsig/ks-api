'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    static associate({ ClanResult }) {
      Stage.belongsTo(ClanResult, {
        foreignKey: 'clanResultId',
        as: 'stage'
      });
    }
  };
  Stage.init({
    // attributes
    battles: DataTypes.INTEGER,
    lossCount: DataTypes.INTEGER,
    target: DataTypes.STRING,
    targetDivision: DataTypes.INTEGER,
    targetDivisionRating: DataTypes.INTEGER,
    targetLeague: DataTypes.INTEGER,
    targetPublicRating: DataTypes.INTEGER,
    type: DataTypes.STRING,
    victoriesRequired: DataTypes.INTEGER,
    winCount: DataTypes.INTEGER,

    // foreign keys
    clanResultId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stage',
    tableName: 'stages',
    timestamps: false,
  });
  return Stage;
};