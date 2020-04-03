const mongoose = require('mongoose');

//Mongoose Model (Work as a Schema)
const Product = mongoose.model('Product', {
    name: String,
    price: Number,
    description: String,
    image: String
});

module.exports = Product;