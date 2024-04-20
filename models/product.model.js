const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user.model");
const Product = db.define(
  "Product",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true, //
  }
);

User.hasOne(Product, { foreignKey: "user_id" });
Product.belongsTo(User, { foreignKey: "user_id" });

module.exports = Product;
