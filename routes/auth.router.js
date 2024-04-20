const express = require("express");
const validateRegistration= require("../validators/register.validator")
const router = express.Router();
const {
  getLogin,
  PostLogin,
  LogOut,
  getRegister,
  Register,
  GetReset,
  Reset,
  GetSetPassword,
  SetPassword
} = require("../controllers/auth.controller");

router.get("/login", getLogin);
router.get("/loqout", LogOut);
router.post("/login", PostLogin);
router.get("/register", getRegister);
router.post("/register",validateRegistration(), Register);
router.get("/reset", GetReset);
router.post("/reset", Reset);
router.get("/set-password/:token", GetSetPassword);
router.post("/set-password",SetPassword );
module.exports = router;
