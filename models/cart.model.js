const Sequelize = require("sequelize");
const db = require("../db");
// const Cart_item =require("./cart-item.model")
const User = require("./user.model")


const Cart = db.define('Cart', {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  }, {
    timestamps: true,
  });

  User.hasOne(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });
  
  module.exports = Cart;
