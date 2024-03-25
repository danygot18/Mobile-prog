const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const multer = require('multer');
const brandController = require('../controllers/BrandController')
// const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');


router.get('/', brandController.getBrand );
router.post('/create', upload.array('images'), brandController.createBrand );
router.delete('/:id', brandController.deleteBrand );



module.exports = router;