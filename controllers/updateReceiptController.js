const path = require('path');
const multer = require('multer');
const { update } = require('../models/receiptUploadUpdate');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({storage})


const updateReceipt = async (req, res) => {
    const currentDate = new Date()
    try {
        // const itemId = req.params.id;
        // console.log(itemId)
        // if(!req.file){
        //     return res.status(400).send('No image file provided')
        // }
        
        // const {so_code, serial, sodosso_name, photo_status} = req.body
        
        // const file_name = `${currentDate.getMonth()}-${(currentDate.getDay() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}.${req.file.filename}`
        
        // const time = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}.${currentDate.getMilliseconds().toString().padStart(6, '0')}`;
        
        // const result = await receiptUploadModel.upload(so_code, serial, sodosso_name, file_name, time, photo_status, itemId)
        // if (!result) {
        //     return res.status(404).send('File submit error')
        // }
        // res.send("Successfully updated")
        const itemId = req.params.id;
        const newData = req.body; // Assuming the request body contains the updated data

        const file_name = `${currentDate.getMonth()}-${(currentDate.getDay() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}_${currentDate.getMinutes().toString().padStart(2, '0')}_${currentDate.getSeconds().toString().padStart(2, '0')}.${req.file.filename}`
        
        const time = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}.${currentDate.getMilliseconds().toString().padStart(6, '0')}`;
        
        newData.file_name = file_name;
        newData.time = time;

        const result = await update(newData, itemId)
        if (!result) {
            return res.status(404).send('File submit error')
        }
        res.send("Successfully updated")

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {updateReceipt, upload}