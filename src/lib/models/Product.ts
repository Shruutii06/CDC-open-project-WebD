import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },
  priceAtSale: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,

    images: [String],

    unitsSold: {
      type: Number,
      default: 0,
    },

    sales: {
      type: [SaleSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
