const {db} = require('../config/dbConfig')


module.exports.getCollectionSheet = (soCode, collectionDay) =>{

    try {
        const collectionSheetQuery = `
            SELECT *
            FROM 7_sodosso_vorti
            WHERE so_code = ? 
            AND collection_bar = ?
            AND sodosso_status = '1'
            AND (gateway_check_sonchoy != '1' OR gateway_check_kisti != '1')
            AND (sonchoy > 0 OR kisti > 0)
        `;

        return db.execute(collectionSheetQuery, [soCode, collectionDay])
    } catch (error) {
        console.error(error)
        throw error
    }
}