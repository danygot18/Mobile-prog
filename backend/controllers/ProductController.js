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
    
        const files = req.files; // Assuming req.files contains an array of image files
        if (!files || files.length === 0) return res.status(400).send('No images in the request');
    
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
        const images = files.map(file => {
            return `${basePath}${file.filename}`;
        });
    
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            images: images, // Store array of image URLs
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
}

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
    
        let imagePaths = product.images; // Default to existing image paths
    
        if (req.file) {
            // If there's a single file uploaded, update the image path
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagePaths = `${basePath}${fileName}`;
        }
    
        if (req.files && req.files.length > 0) {
            // If there are multiple files uploaded, update the image paths array
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            const newImages = req.files.map(image => `${basePath}${image.filename}`);
            imagePaths = newImages;
        }
    
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                images: imagePaths,
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
