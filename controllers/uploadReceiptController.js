const path = require('path');
const multer = require('multer');
const receiptUploadModel = require('../models/receiptUploadModel');
const { db } = require("../config/dbConfig");


// Multer storage configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({storage});


const uploadReceipt = async (req, res) => {
    const currentDate = new Date()
    try {
        if(!req.file){
            return res.status(400).send('No image file provided')
        }
        const { so_code, collection_id, account_no } = req.body;
        const file_name = `${currentDate.getMonth()}-${(currentDate.getDay() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}.${req.file.filename}`
        const base = process.env.BASE_URL;
        const file_url = base+"uploads/"+file_name;
        const result = await receiptUploadModel.upload(so_code, collection_id, account_no, file_name, file_url);
        if (!result) {
            return res.status(404).send('File submit error')
        }

        console.log(result);

        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {uploadReceipt, upload}