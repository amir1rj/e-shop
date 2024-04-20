const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user.model");

const Token = db.define(
  "Token",
  {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    expireDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);


User.hasMany(Token, { foreignKey: "user_id" });
Token.belongsTo(User, { foreignKey: "user_id" });
module.exports = Token;
