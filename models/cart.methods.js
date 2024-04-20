const Cart = require("./cart.model");
const Cart_item = require("./cart-item.model");
const User = require("./user.model");
const Product = require("./product.model");
Cart.addProductToCart = async function (productId, userId) {
  try {
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    let cartItem = await Cart_item.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = await Cart_item.create({
        cart_id: cart.id,
        product_id: productId,
        quantity: 1,
      });
    }

    return cartItem;
  } catch (error) {
    throw new Error("Failed to add product to cart: " + error.message);
  }
};
Cart.removeProductFromCart = async function (productId, userId) {
  try {
    // Find the cart associated with the user
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Find the cart item associated with the product in the cart
    let cartItem = await Cart_item.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new Error("Product not found in the cart");
    }

    // Decrement the quantity of the cart item or delete it if quantity is 1
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    } else {
      await cartItem.destroy();
    }

    return cartItem;
  } catch (error) {
    throw new Error("Failed to remove product from cart: " + error.message);
  }
};
Cart.emptyCart = async function(userId) {
  try {
    // Find the cart associated with the user
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      throw new Error("Cart not found for the user");
    }

    // Find all cart items associated with the cart and delete them
    await Cart_item.destroy({ where: { cart_id: cart.id } });

    return true; // Indicate success
  } catch (error) {
    throw new Error("Failed to empty cart: " + error.message);
  }
};

Cart.hasMany(Cart_item, { foreignKey: "cart_id" });
User.hasOne(Cart, { foreignKey: "user_id" });
module.exports = Cart;
