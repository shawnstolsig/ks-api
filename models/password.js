'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Password extends Model {
    static associate({ User }) {
      Password.belongsTo(User, {
        as: 'password',
        foreignKey: 'userId'
      })
    }
  };
  Password.init({

    // attributes
    hash: DataTypes.STRING,

    // foreign keys
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Password',
    tableName: 'passwords',
    timestamps: false
  });
  return Password;
};
