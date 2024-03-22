const {Brand} = require('../models/brand');

exports.getBrand = async (req, res) => {
    const brandList = await Brand.find();
    
    if (!brandList) {
        req.status(500).json({success: false})
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

exports.createBrand = async (req, res) => {
    let brand = new Brand({
        name: req.body.name,
        location: req.body.location,
        icon: req.body.icon,
        color: req.body.color
    })
 
    brand = await brand.save();

    if (!brand)
        return res.status(400).send('the brand cannot be created!')

    res.send(brand);
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
