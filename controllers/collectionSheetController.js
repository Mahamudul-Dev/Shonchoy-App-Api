const { db } = require('../config/dbConfig')
const collectionSheet =  require('../models/collectionSheetModel')

module.exports.getCollectionSheet = async (req, res) => {
    try {
        const {soCode, collectionDay} = req.body
        console.log(soCode)
        console.log(collectionDay)
        const sheet = await collectionSheet.getCollectionSheet(soCode,collectionDay)
        console.log(sheet[0].length)
        if (!sheet) {
            return res.status(404).send('Sheet not found')
        }

        // const sonchoy_collection_status_7 = [];
        // const sonchoy_collection_status_30 = [];
        // sheet[0].map(item => {
        //     if (item.sonchoy_collection_status == 7) {
        //         sonchoy_collection_status_7.push(item.serial)
        //     } else {
        //         sonchoy_collection_status_30.push(item.serial)
        //     }
        // })
        
        // const sonchoy_collection_3 = await db.execute('SELECT * FROM 3_sonchoy_collection')

        // const dateStr = collectionDate;
        // const dateParts = dateStr.split('-');

        // const year = dateParts[0];
        // const month = dateParts[1];

        // const finalSheet = [];
        

        // sonchoy_collection_3[0].map(item => {
        //     const dateString = item.date;
        //     const date = new Date(dateString);

        //     const sonchoy_year = date.getFullYear();
        //     const sonchoy_month = date.getMonth() + 1; 

        //     sheet[0].map(itemSheet => {
        //         if (year == sonchoy_year && month == sonchoy_month) {
        //             finalSheet.push(itemSheet)
        //         }
        //     })
        // })
          
        res.json(sheet[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}