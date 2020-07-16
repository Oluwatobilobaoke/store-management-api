const express = require("express")
const { protect, authorize } = require("../middlewares/auth");

const {
    getProducts,
    getProduct,
    addToCart,
    getCart,
    deleteCartProduct,
    addOrder,
    fetchOrders
} = require("../controllers/shop");

const { getProductsByName } = require('../controllers/user');

const router = express.Router();

router.route('').get(protect, getProductsByName);

/**
 * @desc fetches products
 * @method get
 * @api public
 */
router.get("/products", getProducts);

/**
 * @desc fetches a product
 * @method get
 * @api public
 */
router.get("/products/:id", getProduct);

/**
 * @desc gets all items in a cart
 * @method get
 * @api user
 */
router.get("/cart", protect, authorize, getCart);

/**
 * @desc adds an item to a cart
 * @method post
 * @api user
 */
router.post("/add-to-cart/:id", protect, authorize, addToCart);

/**
 * @desc deletes an item from a cart
 * @method delete
 * @api user
 */
router.delete("/delete-from-cart/:id", protect, authorize, deleteCartProduct);

/**
 * @desc creates an order
 * @method post
 * @api user
 */
router.post("/create-order", protect, authorize, addOrder);

/**
 * @desc fetches all orders specific to a user
 * @method get
 * @api user
 */
router.get("/orders", protect, authorize, fetchOrders);


module.exports = router;
