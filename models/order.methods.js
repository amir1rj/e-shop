const User = require("./user.model");
const Cart = require("./cart.model");
const Order_item = require("./order-item.model");
const Order = require("./order.model");
const Product = require("./product.model");
Order.createOrderForUser = async function (userId) {
  try {
    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Get cart items
    const cartItems = await cart.getCart_items();

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Find the last order for the user
    const lastOrder = await Order.findOne({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    // Create an order for the user
    let order;
    if (!lastOrder || lastOrder.is_paid) {
      order = await user.createOrder({ is_paid: false });
    } else {
      order = lastOrder;
    }

    // Add cart items to the order
    await Promise.all(
      cartItems.map(async (cartItem) => {
        await Order_item.create({
          order_id: order.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
        });
      })
    );

    return order;
  } catch (error) {
    throw new Error("Failed to create order: " + error.message);
  }
};
Order.getOrderItemsArray = async (orderId) => {
  try {
    const orderItems = await Order_item.findAll({
      where: { order_id: orderId },
      include: [{ model: Product }],
    });

    return orderItems.map((orderItem) => orderItem.toJSON());
  } catch (error) {
    throw new Error("Failed to get order items: " + error.message);
  }
};
Order.hasMany(Order_item, { foreignKey: "order_id" });
User.hasOne(Order, { foreignKey: "user_id" });
module.exports = Order;
