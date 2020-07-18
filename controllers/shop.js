const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const { populate, where } = require("../models/product");
const user = require("../models/user");

//  gets all products

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(goods => {
      console.log(goods);
      res.status(200).send(goods);
    })
    .catch(err => console.log(err));
};

// gets a single product

exports.getProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      console.log(product);
      res.status(200).send(product);
    })
    .catch(err => console.log(err));
};

// adds an product(s) to a cart

exports.addToCart = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then(product => {
      console.log(product);
      console.log(req.user);
      
      User.findOne({ _id: req.user._id }).then(user => {
        console.log('thisisisisi', user._id);
        
        return user.addToCart(product);
      });
    })
    .then(result => {
      res
        .status(200)
        .send({ success: true, message: "product successfully added to cart" });
    })
    .catch(err => console.log(err));
};

//  gets a cart as specific to a user

exports.getCart = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate("cart.products.productId")
    .then(user => {
      res.status(200).send(user.cart.products);
    })
    .catch(err => console.log(err));
};

//  removes an product from a cart

exports.deleteCartProduct = (req, res, next) => {
  const productId = req.params.id;
  User.findOne({ _id: req.user._id })
    .then(user => {
      user
        .removeFromCart(productId)
        .then(
          res
            .status(200)
            .send({ message: "product successfully removed from cart" })
        );
    })
    .catch(err => console.log(err));
};

// creates an order

exports.addOrder = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate("cart.products.productId")
    .then(user => {
      const products = user.cart.products.map(product => {
        return { quantity: product.quantity, product: { ...product.productId._doc } };
      });
      const order = new Order({
        user: {
          email: user.email,
          userId: req.user._id
        },
        products
      });
      order.save();
      return user.clearCart();
    })
    .then(res.status(200).json({"message": "Successfully placed order"}))
    .catch(err => console.log(err));
};

// fetches all orders specific to a user

exports.fetchOrders = (req, res, next) => {
console.log(req.user._id);

    Order.findOne({user: {userId: req.user._id}})
    .then(orders => {
      
      console.log(orders);
      
      res.status(200).send(orders);
    })
    .catch(err => console.log(err));
};

//fetch all orders to a user
exports.fetchOrderByID = (req, res, next) => {

  Order.find({_id: req.params.id})
  .then(orders => {
    
    console.log(orders);
    
    res.status(200).send(orders);
  })
  .catch(err => console.log(err));
};


//fetch all orders
exports.getAllOrder = (req, res, next) => {
  Order.find()
    .then(orders => {
      console.log(orders);
      res.status(200).send(orders);
    })
    .catch(err => console.log(err));
};



