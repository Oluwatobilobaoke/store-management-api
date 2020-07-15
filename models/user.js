const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { 
        type: String,
        required: [true, 'Please add a first name'] 
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name'] 
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: { 
        type: Boolean,
        default: true 
    },
    isAdmin: {
        type: Boolean,
        default: false 
        },
    role: {
        type: String,
        enum: ['attendant']
        },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

// Instance method to add an item to user's cart

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.products.findIndex(cartProduct => {
    return cartProduct.productId.toString() === product._id.toString();
  });

  let newQty = 1;
  const updatedCartProducts = [...this.cart.products];

  if (cartProductIndex >= 0) {
    newQty = this.cart.products[cartProductIndex].quantity + 1;
    updatedCartProducts[cartProductIndex].quantity = newQty;
  } else {
    updatedCartProducts.push({
        productId: product._id,
      quantity: newQty
    });
  }
  this.cart = {
    products: updatedCartProducts
  };

  return this.save();
};

// Instance method to remove an item from user's cart

userSchema.methods.removeFromCart = function(id) {
  const updatedCartProducts = this.cart.products.filter(product => {
    return product.productId.toString() !== id.toString();
  });
  this.cart.products = updatedCartProducts;
  return this.save();
};

// Instance method to clear user's cart

userSchema.methods.clearCart = function() {
  this.cart = { products: [] };
  return this.save();
};

userSchema.index({ firstName: 'text' });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
