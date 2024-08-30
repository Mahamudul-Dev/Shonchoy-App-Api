const { db } = require("../config/dbConfig");

module.exports.upload = async (so_code, collection_id, account_no, file_name, url) => {
  try {
    const previousEntryCheckSql = `SELECT collection_id FROM collection_receipt WHERE collection_id=?;`

    const prevousEntryResult = await db.execute(previousEntryCheckSql, [
      collection_id,
    ]);

    const previousEntry = prevousEntryResult[0];

    console.log(previousEntry.length);

    let insertQuery;
    
    if (previousEntry.length === 0) {
      insertQuery =
        "INSERT INTO collection_receipt (so_code, collection_id, account_no, file_name, url) VALUES (?,?,?,?,?)";
    } else {
      insertQuery =
        "UPDATE collection_receipt SET so_code = ?, collection_id=?, account_no=?, file_name=?, url=? WHERE collection_id = "+collection_id;
    }


    return db.execute(insertQuery, [
      so_code,
      collection_id,
      account_no,
      file_name,
      url,
    ]);
  } catch (error) {
    console.error(error);
  }
};
