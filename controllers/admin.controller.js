const Product = require("../models/product.model");
const {deleteFile}= require("../util/file")
const ITEM_PER_PAGE = 2
module.exports.getAddProducts = function getProducts(req, res) {
  res.render("admin/form.ejs", {
    path: "/admin/addProduct",
    edit: false,
  });
};

module.exports.addProduct = async (req, res) => {
  title = req.body.title;
  description = req.body.description;
  price = req.body.price;
  image_url = req.file.path;

  try {
    const product = await Product.create({
      title: title,
      description: description,
      price: price,
      image_url: image_url,
      user_id: req.user.id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating product",
      error: error,
    });
  }
};

module.exports.getEditProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * ITEM_PER_PAGE;

  const { rows: products, count: totalProducts } = await Product.findAndCountAll({
    limit: ITEM_PER_PAGE,
    offset: offset,
  });
  const totalPages = Math.ceil(totalProducts / ITEM_PER_PAGE);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;
  res.render("shop/index.ejs", {
    path: "/admin/getProducts",
    products: products,
    edit: true,
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    next_page: nextPage,
    previous_page: previousPage,
    totalPages:totalPages,
    page:page
  });
};
module.exports.getEditProduct = async (req, res) => {
  id = req.params.id;

  const product = await Product.findOne({
    id: id,
    user_id: req.user.id,
  });
  if (req.user.id !== product.user_id) {
    res.redirect("/");
  }
  res.render("admin/form.ejs", {
    path: "/admin/editProduct",
    edit: true,
    product: product,
  });
};
module.exports.editProduct = async (req, res) => {
  title = req.body.title;
  description = req.body.description;
  price = req.body.price;
  image_url = req.body.image_url;
  id = req.body.id;
  try {
    deleteFile(image_url);
    const product = await Product.update(
      {
        title: title,
        description: description,
        price: price,
        image_url: image_url,
      },
      {
        where: {
          id: id,
          user_id: req.user.id,
        },
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error editing product",
      error: error,
    });
  }
  res.redirect("/");
};
module.exports.deleteProduct = async (req, res) => {
  id = req.params.id;

  try {
    const product = await Product.findOne({
      id: id,
      user_id: req.user.id,
    });
    deleteFile(product.image_url)
    product.destroy();
  } catch {
    console.error(error);
    res.status(500).json({
      message: "Error editing product",
      error: error,
    });
  }
  res.redirect("/");
};
