const express = require('express');
const categoryHandler = require('../handlers/categoryHandler');

const router = express.Router();

router.get('/', categoryHandler.getAllCategories);
router.get('/:categoryName', categoryHandler.getCategoryByName);
router.post('/', categoryHandler.createCategory);
router.put('/:categoryName', categoryHandler.updateCategoryByName);
router.delete('/:categoryName', categoryHandler.deleteCategoryByName);

module.exports = router;
