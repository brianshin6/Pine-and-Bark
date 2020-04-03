const Product = require('../models/product');

const products = async (req, res) => {
    const products = await Product.find().exec();
    res.render('products', { products })
}

module.exports = products;