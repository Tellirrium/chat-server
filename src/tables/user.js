module.exports = (sequelize, type) => sequelize.define('user', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: type.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: type.STRING,
    allowNull: false,
  },
  picture: {
    type: type.STRING,
  },
  password: {
    type: type.STRING,
    allowNull: false,
  },
});
