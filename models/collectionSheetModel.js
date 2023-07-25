const {db} = require('../config/dbConfig')


module.exports.getCollectionSheet = (soCode, collectionDay) =>{
    console.log(collectionDay,soCode)

    try {
        return db.execute('SELECT * FROM 7_sodosso_vorti WHERE so_code = ? AND collection_bar = ?', [soCode, collectionDay])
    } catch (error) {
        console.error(error)
        throw error
    }
}