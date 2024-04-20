const User = require("../models/user.model");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const sendEmail = require("../util/send.email");
const { v4: uuidv4 } = require("uuid");
const Token = require("../models/token.model");
const { validationResult } = require('express-validator');
module.exports.getLogin = (req, res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  const displayErrorMessage = errorMessage.length > 0 ? errorMessage : null;
  const displaySuccessMessage =
    successMessage.length > 0 ? successMessage : null;
  res.render("auth/login", {
    path: "/login",
    edit: false,
    errorMessage: displayErrorMessage,
    successMessage: displaySuccessMessage,
  });
};

module.exports.PostLogin = (req, res) => {
  password = req.body.password;
  username = req.body.username;
  User.findOne({
    where: {
      [Sequelize.Op.or]: [{ email: username }, { username: username }],
    },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid username or email");
        res.redirect("/login");
      } else {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (!result) {
              req.flash("error", "your password is incorrect");

              res.redirect("/login");
            } else {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.flash("success", "you are logged in successfuly");
              res.redirect("/");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports.LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
};

module.exports.getRegister = (req, res) => {
  const errorMessage = req.flash("error");

  const displayErrorMessage = errorMessage.length > 0 ? errorMessage : null;
  res.render("auth/register", {
    path: "/register",
    edit: false,
    errorMessage: displayErrorMessage,
  });
};

module.exports.Register = (req, res) => {
  email = req.body.email;
  console.log("salam")
  password = req.body.password;
  username = req.body.username;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    req.flash('error', errorMessages);
    res.redirect('/register');
  } 
  User.findOne({
    where: {
      [Sequelize.Op.or]: [{ email: email }, { username: username }],
    },
  })
    .then((existingUser) => {
      if (existingUser) {
        req.flash("error", "User with email or username already exists");
        res.redirect("/register");
      } else {
        User.create({
          email: email,
          username: username,
          password: password,
        })
          .then((newUser) => {
            req.flash("success", "your account created successfuly");
            sendEmail({
              subject: "register successfuly",
              text: "your account created successfuly",
              email: email,
            });
            res.redirect("/login");
          })
          .catch((err) => {
            console.error("Error creating user:", err);
          });
      }
    })
    .catch((err) => {
      console.error("Error checking for existing user:", err);
    });
};

module.exports.GetReset = (req, res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  const displayErrorMessage = errorMessage.length > 0 ? errorMessage : null;
  const displaySuccessMessage =
    successMessage.length > 0 ? successMessage : null;
  res.render("auth/reset", {
    path: "/reset",
    edit: false,
    errorMessage: displayErrorMessage,
    successMessage: displaySuccessMessage,
  });
};

module.exports.Reset = async (req, res) => {
  const email = req.body.email;

  try {

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      req.flash("error", "Invalid email");
      return res.redirect("/reset");
    }


    await Token.destroy({
      where: { user_id: user.id },
    });

  
    const token = uuidv4();
    await Token.create({
      token: token,
      user_id: user.id,
      expireDate: new Date(Date.now() + 1000 * 60 * 5),
    });

   
    await sendEmail({
      subject: "Reset Password",
      text: `<p>For creating a new password click <a href="localhost:3000/set-password/${token}">here</a></p>`,
      email: email,
    });

    req.flash(
      "success",
      "Password reset email has been sent. Please check your email inbox."
    );
    return res.redirect("/reset");
  } catch (error) {
    console.error("Error sending reset password email:", error);
    req.flash("error", "Something went wrong");
    return res.redirect("/reset");
  }
};

module.exports.GetSetPassword = async (req, res) => {
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  const displayErrorMessage = errorMessage.length > 0 ? errorMessage : null;
  const displaySuccessMessage =
    successMessage.length > 0 ? successMessage : null;

  const token = req.params.token;
  const userTokden = await Token.findOne({
    where: {
      token: token,
    },
  });
  if (!token) {
    req.flash("error", "Invalid token");
    return res.redirect("/reset");
  }
  const user = await User.findOne({
    where: {
      id: userTokden.user_id,
    },
  });
  if (!user) {
    req.flash("error", "something is wrong");
    return res.redirect("/reset");
  }

  res.render("auth/set-password", {
    path: "/set-password",
    edit: false,
    errorMessage: displayErrorMessage,
    successMessage: displaySuccessMessage,
    token: token,
  });
};

module.exports.SetPassword = async (req, res) => {
  const password = req.body.password;
  const tokenValue = req.body.token;

  try {
    const token = await Token.findOne({
      where: { token: tokenValue }
    });

    if (!token || (token.expireDate && token.expireDate < new Date())) { 
      req.flash("error", "Token is expired or invalid");
      return res.redirect("/reset");
    }

    const user = await User.findByPk(token.user_id);
    user.password = password;

    await user.save();
    await token.destroy();

    req.flash("success", "Password has been successfully updated");
    res.redirect("/login");
  } catch (error) {
    console.error("Error setting password:", error);
    req.flash("error", "Something went wrong. Please try again later.");
    res.redirect("/reset");
  }
};