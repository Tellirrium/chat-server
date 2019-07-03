module.exports = (sequelize, type) => sequelize.define('message', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  text: type.STRING,
});
