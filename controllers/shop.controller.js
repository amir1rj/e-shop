const Product = require("../models/product.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.methods");
const Order = require("../models/order.methods");
const path = require("path");
const {generatePDF} = require("../util/pdf")

const ITEM_PER_PAGE =2;
exports.shopindex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * ITEM_PER_PAGE;

  const { rows: products, count: totalProducts } = await Product.findAndCountAll({
    limit: ITEM_PER_PAGE,
    offset: offset,
  });
  // const totalProducts = await products.count();
  const totalPages = Math.ceil(totalProducts / ITEM_PER_PAGE);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;
  console.log(nextPage, previousPage,hasNextPage,hasPreviousPage,totalPages)
  res.render("shop/index.ejs", {
    path: "/",
    products: products,
    edit: false,
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    next_page: nextPage,
    previous_page: previousPage,
    totalPages:totalPages,
    page:page
    
  });
};

exports.getProduct = async (req, res) => {
  let id = req.params.id;

  const product = await Product.findByPk(id);
  res.render("shop/product-details.ejs", {
    path: "/product",
    product: product,
  });
};
module.exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  res.render("shop/product-list.ejs", {
    path: "/products",
    f: products,
    edit: false,
  });
};

module.exports.AddProductToCart = async (req, res) => {
  productId = req.params.id;
  UserId = req.user.id;
  Cart.addProductToCart(productId, UserId);
  res.redirect("/");
};
module.exports.GetCart = async (req, res) => {
  const UserId = req.user.id;
  try {
    const user = await User.findByPk(UserId);
    const cart = await user.getCart();
    if (!cart) {
      res.render("shop/cart.ejs", {
        path: "/cart",
        cartItems: [],
        edit: false,
      });
    }
    const cartItems = await cart.getCart_items({
      include: [{ model: Product }],
    });
    const cartItemsArray = cartItems.map((cartItem) => cartItem.toJSON());
    console.log(cartItemsArray);
    res.render("shop/cart.ejs", {
      path: "/cart",
      cartItems: cartItemsArray,
      edit: false,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.DeleteCartItem = async (req, res) => {
  try {
    await Cart.removeProductFromCart(req.body.ProductId, req.user.id);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/cart");
};

module.exports.AddOrder = async (req, res) => {
  try {
    await Order.createOrderForUser(req.user.id);
    await Cart.emptyCart(req.user.id);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/cart");
};

module.exports.GetOrders = async (req, res) => {
  const UserId = req.user.id;
 
  try {
    const user = await User.findByPk(parseInt(UserId));
  
    const order = await user.getOrder();
 
    if (!order) {
      res.render("shop/order.ejs", {
        path: "/orders",
        orderItems: [],
        edit: false,
      });
      return;
    }

    const orderItemsArray = await Order.getOrderItemsArray(order.id);
    console.log(orderItemsArray)
    res.render("shop/order.ejs", {
      path: "/orders",
      orderItems: orderItemsArray,
      edit: false,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.DownloadReport = (req, res) => {
  id = req.params.id;
  console.log('--------------------------------')
  console.log(id)
  const order = Order.findByPk(id)
    .then(async (order) => {
      console.log(order.id)
      const invoice = `invois-${id}.pdf`;
      const invoicepath = path.join("invoises", invoice);
      const orderItemsArray = await Order.getOrderItemsArray(order.id);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=" + invoice);
      generatePDF(orderItemsArray,res)
    })
    .catch((error) => {
      throw new Error(error);
    });
};
