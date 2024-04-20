const express = require("express");
const router = express.Router();
const isAthenticated = require("../middlewares/isAuthenticated")
const {
  addProduct,
  getAddProducts,
  getEditProducts,
  getEditProduct,
  editProduct,
  deleteProduct
} = require("../controllers/admin.controller");

router.post("/addProduct",isAthenticated, addProduct);
router.get("/addProduct",isAthenticated, getAddProducts);

router.get("/getProducts",isAthenticated, getEditProducts);
router.get("/editProduct/:id", isAthenticated,getEditProduct);
router.post("/editProduct",isAthenticated, editProduct);
router.get("/deleteProduct/:id",isAthenticated, deleteProduct);

module.exports = router;
