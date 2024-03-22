const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const brandController = require('../controllers/BrandController')
// const { isAuthenticated, isAuthorized } = require('../middlewares/Auth');

router.get('/', brandController.getBrand );
router.post('/create', brandController.createBrand );
router.delete('/:id', brandController.deleteBrand );

module.exports = router;