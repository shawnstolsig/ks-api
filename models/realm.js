'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Realm extends Model {
    static associate({ Battle, Clan, Player }) {

      Realm.hasMany(Battle, { foreignKey: 'realmId'})
      Realm.hasMany(Clan, { foreignKey: 'realmId' })
      Realm.hasMany(Player, { foreignKey: 'realmId' })

    }
  };
  Realm.init({
    // attributes
    abbreviation: DataTypes.STRING,
    name: DataTypes.STRING,
    domain: DataTypes.STRING,
    wgRealm: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Realm',
    tableName: 'realms',
    timestamps: false,
  });
  return Realm;
};