/* eslint-disable max-len */

require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});

const UserModel = require('./tables/user');
const MessageModel = require('./tables/message');

const User = UserModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);


User.hasMany(Message, { as: 'Users' });
Message.belongsTo(User);


sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = {
  Message,
  User,
};
