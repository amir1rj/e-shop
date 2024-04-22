const express = require("express");
const session = require("express-session");
const app = express();
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const path = require("path");
const PORT = 5000;
const body_parser = require("body-parser");

const User = require("./models/user.model");
const flash = require('connect-flash');
// multer configuration
const multer = require('multer');
const multerStore = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder where uploaded files will be stored
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    // Extract the file extension from the original filename
    const fileExtension = file.originalname.split('.').pop();
    // Generate a unique prefix for the filename
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Construct the unique filename by combining the prefix and original filename
    const uniqueFilename = uniquePrefix + '-' + file.originalname;
    // Pass the unique filename to the callback function
    cb(null, uniqueFilename);
  }
});
const imageFilter = (req, file, cb) => {
  // Check if the file mimetype starts with 'image/'
  if (file.mimetype.startsWith('image/')) {
    // Accept the file, pass true to the callback
    cb(null, true);
  } else {
    // Reject the file, pass false to the callback with an error message
    cb(new Error('Only image files are allowed'));
  }
};


//csrf configuration
const csrf = require('csurf');
const csrfProtection = csrf();
 

// database connection
const db = require("./db");
const sessionStore = new SequelizeStore({
  db: db,
});

// routers
const shopRouter = require("./routes/shop.router");
const AdminRouter = require("./routes/admin.router");
const AuthRouter = require("./routes/auth.router");
// configs
app.set("view engine", "ejs");
app.use(body_parser.urlencoded({ extended: true }));
app.use(multer({
  storage: multerStore,
  fileFilter: imageFilter
}).single("file"))
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("views", "views");
//middlewares
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);
app.use(csrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});


app.use((req,res,next)=>{
 
  res.locals.isAthenticated=req.session.isLoggedIn;
  res.locals.csrfToken=req.csrfToken();
  next();
});
app.use(flash());
// routes
app.use(shopRouter);
app.use(AuthRouter);
app.use("/admin", AdminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = { db };
