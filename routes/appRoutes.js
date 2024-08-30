const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const collectionSheetController = require('../controllers/collectionSheetController');
const {uploadReceipt, upload} = require('../controllers/uploadReceiptController');
const { updateReceipt } = require('../controllers/updateReceiptController');
const sonchoyController = require('../controllers/sonchoyController');
const kistiController = require("../controllers/kistiController");
const gatewayController = require("../controllers/gatewayController");
const skipController = require("../controllers/skipController");



router.post('/login', authController.login);
router.post('/collection-sheet', collectionSheetController.getCollectionSheet);
router.get('/collection-sheet/:serial', collectionSheetController.getSingleCollectionSheet);
router.post('/collection/uploaddReceipt', upload.single('file_name') , uploadReceipt);
router.put('/collection/updateReceipt/:id', upload.single('file_name') , updateReceipt);
router.post('/sonchoy/submit', sonchoyController.sonchoySubmit);
router.post("/kisti/submit", kistiController.kistiSubmit);
router.post("/sonchoy/bokeyaSubmit", sonchoyController.sonchoySubmit);
router.post("/kisti/bokeyaSubmit", kistiController.bokeyaKistiSubmit);
router.get("/gateway/:so_code", gatewayController.getGatewayData);
router.get("/recheck/:so_code", gatewayController.getRecheckRequiredData);
router.get("/recheck/file/:id", gatewayController.getRecheckFormValue);
router.post("/recheck/submit", gatewayController.recheckSubmit);
router.post("/gateway/finalSubmit", gatewayController.finalSubmit);
router.post("/skip/sonchoy", skipController.sonchoySkip);
router.post("/skip/kisti", skipController.kistiSkip);


module.exports = router;
