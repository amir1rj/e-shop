const express = require("express");
const isAthenticated = require("../middlewares/isAuthenticated")
const {
  shopindex,
  getProduct,
  getAllProducts,
  AddProductToCart,
  GetCart,
  DeleteCartItem,
  AddOrder,
  GetOrders,
  DownloadReport
} = require("../controllers/shop.controller");
const router = express.Router();

router.get("/", shopindex);
router.get("/products/addToCart/:id",isAthenticated, AddProductToCart);
router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.get("/cart",isAthenticated, GetCart);
router.post("/cart/delete",isAthenticated, DeleteCartItem);
router.get("/order",isAthenticated, AddOrder);
router.get("/orders",isAthenticated, GetOrders);
router.get("/report/:id",DownloadReport)
module.exports = router;
