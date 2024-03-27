const { Brand } = require('../models/brand');

exports.getBrand = async (req, res) => {
    const brandList = await Brand.find();

    if (!brandList) {
        req.status(500).json({ success: false })
    }
    res.status(200).send(brandList);
}

exports.getBrandId = async (req, res) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.status(500).json({ message: 'The brand with the given ID was not found.' })
    }
    res.status(200).send(brand);;
}

// const uploadMultiple = async ({ imageFiles, request }) => {
//     const basePath = `${request.protocol}://${request.get('host')}/${path}`;

//     const images = imageFiles.map(image => {
//         return `${basePath}${image.filename}`
//     })
    
//     return images
// }

exports.createBrand = async (req, res) => {

    try {
        const file = req.file;
        const imageFiles = req.files; // Assuming req.files contains an array of additional images
    
        if (!file && !imageFiles.length) return res.status(400).send('No images in the request');
    
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
        const mainImage = file ? `${basePath}${file.filename}` : null;
    
        const images = imageFiles.map(image => {
            return `${basePath}${image.filename}`;
        });
    
        let brand = new Brand({
            name: req.body.name,
            location: req.body.location,
            image: mainImage,
            images: images, // Assuming there's a field in Brand model to store multiple images
            // icon: req.body.icon,
            // color: req.body.color
        });
    
        brand = await brand.save();
    
        if (!brand)
            return res.status(400).send('the brand cannot be created!')
    
        res.send(brand);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        console.log(error)
    }
    
    // try {

    //     req.body.images = await ImageFile.uploadMultiple({
    //         imageFiles: req.files,
    //         request: req
    //     })

    //     const brand = await Brand.create(req.body);

    //     return res.status(200).json({
    //         success: true,
    //         message: 'Category successfully added',
    //         brand: brand,
    //     })

    // } catch (err) {
    //     errorHandler({ error: err, response: res })
    // }
}

exports.deleteBrand = async (req, res) => {
    Brand.findByIdAndRemove(req.params.id).then(brand => {
        if (brand) {
            return res.status(200).json({ success: true, message: 'the brand is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "brand not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}



// exports.updateCategory = async (req, res, next) => {
//     try {
//         let brands = await Brand.findById(req.params.id);

//         if (!brands) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Brand not found'
//             });
//         }

//         if (req.files && req.files.length > 0) {
//             let images = [];

//             for (let i = 0; i < req.files.length; i++) {
//                 const image = req.files[i];
//                 const imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${image.filename}`;
//                 images.push(imagePath);
//             }

//             // You may want to handle the deletion of previous images here if necessary

//             req.body.images = images;
//         }

//         brands = await Brand.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//             useFindandModify: false
//         });

//         return res.status(200).json({
//             success: true,
//             brands
//         });
//     } catch (error) {
//         console.error('Error updating category:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to update category'
//         });
//     }
// };
exports.updateCategory = async (req, res) => {
    try {
        const brandId = req.params.id; // Assuming brand ID is passed as a parameter
        
        // Check if brandId is provided
        if (!brandId) return res.status(400).send('Brand ID is required');

        // Find the brand by ID
        let brand = await Brand.findById(brandId);
        
        // If brand doesn't exist, return 404
        if (!brand) return res.status(404).send('Brand not found');

        // Update brand properties
        if (req.body.name) brand.name = req.body.name;
        if (req.body.location) brand.location = req.body.location;
        
        // Handle image updates
        if (req.file) {
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            brand.image = `${basePath}${req.file.filename}`;
        }
        
        if (req.files && req.files.length > 0) {
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            const images = req.files.map(image => `${basePath}${image.filename}`);
            brand.images = images;
        }

        // Save the updated brand
        brand = await brand.save();

        // If brand couldn't be updated, return an error
        if (!brand) return res.status(400).send('The brand could not be updated');

        // Respond with the updated brand
        res.send(brand);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        console.log(error);
    }
};