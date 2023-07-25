const collectionSheet =  require('../models/collectionSheetModel')

module.exports.getCollectionSheet = async (req, res) => {
    try {
        const {soCode,collctionDay} = req.body
        const sheet = await collectionSheet.getCollectionSheet(soCode,collctionDay)

        if (!sheet) {
            return res.status(404).send('Sheet not found')
        }
        res.json(sheet[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}