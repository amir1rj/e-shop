const Sequelize = require("sequelize");
const db = require("../db");

const User = require("./user.model");

const Order = db.define(
  "Order",
  {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    is_paid:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    timestamps: true,
  }
);
User.hasOne(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

module.exports = Order;
