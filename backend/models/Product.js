import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image URL'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a product brand'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
      min: [0, 'Price must be positive'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      default: 0,
      min: [0, 'Stock count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
