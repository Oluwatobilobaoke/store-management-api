const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
  },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

productSchema.index({ title: 'text' });

//Make sure subject name are unique across categories
productSchema.index({ title: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
