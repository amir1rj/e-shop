const Sequelize = require("sequelize");
const db = require("../db");
const Cart = require("./cart.model");
const Product = require("./product.model");

const Cart_item = db.define(
  "Cart_item",
  {
    cart_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Cart,
        key: "id",
      },
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    
  }
);

 
Cart_item.belongsTo(Cart, { foreignKey: "cart_id" });
Cart_item.belongsTo(Product, { foreignKey: "product_id" });
module.exports = Cart_item;

