const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const multer = require('multer');
const brandController = require('../controllers/BrandController')
// const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');


router.get('/', brandController.getBrand );
router.get('/:id', brandController.getBrandId );

router.post('/create', upload.array('images'), brandController.createBrand );
router.delete('/:id', brandController.deleteBrand );
router.put('/:id', upload.array('images'), brandController.updateCategory )


module.exports = router;