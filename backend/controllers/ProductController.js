const { Product } = require('../models/product');
const { Brand } = require('../models/brand');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
    console.log(req.query)
    let filter = {};
    if(req.query.brands)
    {
         filter = {brand: req.query.brands.split(',')}
    }

    const productList = await Product.find(filter).populate('brand');
    // console.log(productList.brand)

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('brand');

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);

};

exports.createProduct = async (req, res) => {
    try {
        const brand = await Brand.findById(req.body.brand);
        if (!brand) return res.status(400).send('Invalid Brand');

        const file = req.file;
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        });

        product = await product.save();

        if (!product) return res.status(500).send('The product cannot be created');

        res.send(product);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send('Invalid Product Id');
        }

        const brand = await Brand.findById(req.body.brand);
        if (!brand) return res.status(400).send('Invalid Brand');

        const product = await Product.findById(id);
        if (!product) return res.status(400).send('Invalid Product!');

        let imagepath = product.image; // Default to existing image path
        const file = req.file;
        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagepath = `${basePath}${fileName}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagepath,
                brand: req.body.brand,
                price: req.body.price,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            },
            { new: true }
        );

        if (!updatedProduct) return res.status(500).send('The product cannot be updated');

        res.send(updatedProduct);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



exports.deleteProduct = async (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
};

exports.getProductCount = async (req, res) => {
    // Implementation of getProductCount function
};

exports.getFeaturedProducts = async (req, res) => {
    // Implementation of getFeaturedProducts function
};

exports.updateGalleryImages = async (req, res) => {
    // Implementation of updateGalleryImages function
};

module.exports = exports;
