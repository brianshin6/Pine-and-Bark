const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');

let uri = "mongodb://localhost:27017/products";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const Product = mongoose.model('Product', {
    name: String,
    image: String
});


const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/products')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage });
app.use('/', express.static('public'));
//Setting up pug as template engine
//using the convention to have all views in views folder.
app.set('view engine', 'pug');
//Index - Entry point - First page a user will see 
app.get('/products', async (req, res) => {
    //internal scope of this function
    const documents = await Product.find().exec();
    const indexVariables = {
        pageTitle: "Products",
        products: documents
    }
    res.render('products', { variables: indexVariables });
});
//Create endpoint
app.get('/create', (req, res) => {
    //internal scope of this function
    res.render('create');
})
//detail view
app.get('/products/:id', async (req, res) => {
    //internal scope of this function
    const selectedId = req.params.id;
    const document = await Product.findById(selectedId).exec();
    res.render('lineup', { product: document });
});
//update view
app.get('/update/:id', async (req, res) => {
    try {
        //internal scope of this function
        const selectedId = req.params.id;
        const document = await Product.findById(selectedId).exec();
        res.render('update', { product: document });
    } catch (err) {
        console.log("ERR: ", err)
    }
});
//delete endpoint
app.get('/delete/:id', async (req, res) => {
    //internal scope of this function
    const idToDelete = req.params.id;
    const document = await Product.findById(idToDelete).exec();
    //Delete the image
    deleteImage(document.image);
    //Delete object from database
    await Product.deleteOne({ _id: idToDelete }).exec();
    res.redirect('/products');
});
//Create post method
app.post('/lineup', upload.single('file'), (req, res) => {
    //internal scope of this function
    const newProduct = {
        name: req.body.product.toUpperCase(),
        image: req.file.filename
    }
    const product = new Product(newProduct);
    product.save()
    res.redirect('/products');
});
//Update method superheroeUpdate
app.post('/productUpdate/:id', upload.single('file'), async (req, res) => {
    try {
        const idToUpdate = req.params.id;

        //create the updateObject
        let updateObject = {
            "name": req.body.product.toUpperCase(),
        }
        //logic to handle the image
        if (req.file) {
            console.log("Updating image");
            updateObject.image = req.file.filename;
        }
        //call update on database
        let filter = { _id: idToUpdate };

        //find the document and put in memory
        const document = await Product.findById(idToUpdate).exec();

        let result = await Product.updateOne(filter, updateObject).exec();
        if (result.ok > 0 && req.file) {
            // delete the image 
            deleteImage(document.image);
        }
    } catch (err) {
        console.log("ERR: ", err);
    } finally {
        //redirect user to index
        res.redirect('/products');
    }
});

function deleteImage(image){
    const dir = __dirname + "/public/img/products/" + image;
    if (fs.existsSync(dir)) {
        fs.unlink(dir, (err) => {
            if (err) throw err;
            console.log('successfully deleted images from folder products');
        });
    }
}

app.get('/about', (req, res) => {
    res.render('about', {})
});

app.get('/contact', (req, res) => {
    res.render('contact', {})
});

app.get('/', (req, res) => {
    res.render('home', {})
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});