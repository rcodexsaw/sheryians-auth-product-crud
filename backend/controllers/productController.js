const mongoose = require('mongoose');
const Product = require('../models/Product');

async function createProduct(req, res, next) {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ message: 'Product created', product });
  } catch (err) { next(err); }
}

async function listProducts(req, res, next) {
  try {
    const products = await Product.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ count: products.length, products });
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only update your own products' });
    Object.assign(product, req.body);
    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only delete your own products' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
}

function invalidObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid product id' });
  next();
}

module.exports = { createProduct, listProducts, getProduct, updateProduct, deleteProduct, invalidObjectId };
