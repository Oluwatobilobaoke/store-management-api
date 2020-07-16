const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

//  gets all items

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.status(200).send(products);
    })
    .catch(err => console.log(err));
};

// gets a single item

exports.getProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      console.log(Product);
      res.status(200).send(product);
    })
    .catch(err => console.log(err));
};

// adds an item(s) to a cart

exports.addToCart = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then(product => {
      User.findOne({ _id: req._id }).then(user => {
        return user.addToCart(product);
      });
    })
    .then(result => {
      res
        .status(200)
        .send({ success: true, message: "Product successfully added to cart" });
    })
    .catch(err => console.log(err));
};

//  gets a cart as specific to a user
exports.getCart = (req, res, next) => {
  User.findOne({ _id: req._id })
    .populate("cart.products.productId")
    .then(user => {
      res.status(200).send(user.cart.products);
    })
    .catch(err => console.log(err));
}

//  removes a product from a cart

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.params.id;
  User.findOne({ _id: req._id })
    .then(user => {
      user
        .removeFromCart(productId)
        .then(
          res
            .status(200)
            .send({ message: "Product successfully removed from cart" })
        );
    })
    .catch(err => console.log(err));
};

// creates an order

exports.addOrder = (req, res, next) => {
  User.findOne({ _id: req._id })
    .populate("cart.products.productId")
    .then(user => {
      const products = user.cart.products.map(product => {
        return { quantity: product.quantity, product: { ...product.productId._doc } };
      });
      const order = new Order({
        user: {
          email: user.email,
          userId: req._id
        },
        products
      });
      order.save();
      return user.clearCart();
    })
    .then(res.status(200).send("Successfully placed order"))
    .catch(err => console.log(err));
};

// fetches all orders specific to a user

exports.fetchOrders = (req, res, next) => {
  Order.find({ "user.userId": req._id })
    .then(orders => {
      res.status(200).send(orders);
    })
    .catch(err => console.log(err));
};