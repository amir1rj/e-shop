const Sequelize = require("sequelize");
const db = require("../db");
const Order = require("./order.model");
const Product = require("./product.model");

const Order_item = db.define(
  "Order_item",
  {
    order_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Order,
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

 
Order_item.belongsTo(Order, { foreignKey: "order_id" });
Order_item.belongsTo(Product, { foreignKey: "product_id" });
module.exports = Order_item;  