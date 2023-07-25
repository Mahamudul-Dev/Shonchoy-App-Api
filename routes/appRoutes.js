const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const collectionSheetController = require('../controllers/collectionSheetController');
const uploaddReciptController = require('../controllers/uploadReceiptController')


router.post('/login', authController.login);
router.post('/collection-sheet', collectionSheetController.getCollectionSheet);
router.post('/collection/uploaddReceipt', uploaddReciptController.uploadReceipt);

module.exports = router;
