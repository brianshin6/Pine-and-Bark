const mongoose = require('mongoose');

//Mongoose Model
const Product = mongoose.model('Product', {
    name: String,
    price: Number,
    description: String,
    image: String
});

module.exports = Product;