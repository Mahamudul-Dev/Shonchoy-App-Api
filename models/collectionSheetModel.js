const {db} = require('../config/dbConfig')


module.exports.getCollectionSheet = async (soCode, collectionDay) =>{

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


            // AND collection_bar = ?
            // AND sodosso_status = '1'
            // AND (gateway_check_sonchoy != '1' OR gateway_check_kisti != '1')
            // AND (sonchoy > 0 OR kisti > 0)

        return db.execute(collectionSheetQuery, [soCode, collectionDay])
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports.getSingleCollectionSheet = (serial) => {
  try {
    const collectionSheetQuery = `
            SELECT *
            FROM 7_sodosso_vorti
            WHERE serial = ?;
        `;

    return db.execute(collectionSheetQuery, [serial]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.collectionSheetFilter = (month, year, serial) =>{

    try {
        const collectionSheetQuery = `
        SELECT account_no
        FROM 3_sonchoy_collection
        WHERE DATE_FORMAT(date, '%m') = ?
        AND DATE_FORMAT(date, '%Y') = ?
        AND account_no = ?
        AND ac_des_id = 1006
        `;

        return db.execute(collectionSheetQuery, [month, year, serial])
    } catch (error) {
        console.error(error)
        throw error
    }
}