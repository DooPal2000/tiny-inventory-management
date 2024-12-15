const Product = require('../models/product');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id });
    res.render('products/index', { products });
};

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    product.createdBy = req.user._id;
    await product.save();

    // 저장한 후 createdBy가 req.user._id인 모든 product를 가져옴
    const products = await Product.find({ createdBy: req.user._id });

    // products를 index 페이지로 렌더링
    res.render('products/index', { products });
};

module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });

    // 저장한 후 createdBy가 req.user._id인 모든 product를 가져옴
    const products = await Product.find({ createdBy: req.user._id });

    // products를 index 페이지로 렌더링
    res.render('products/index', { products });
};

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
};

