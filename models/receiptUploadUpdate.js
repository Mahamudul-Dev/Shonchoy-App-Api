const {db} = require('../config/dbConfig')

module.exports.update = async (newData, id) => {
console.log(newData)
console.log(id)
    try {

      const [checkRows] = await db.execute(
        'SELECT * FROM 7_sodosso_vorti WHERE so_code = ? AND serial = ?',
        [newData.so_code, newData.serial]
      );
      
      const rowCheck = checkRows[0];
      console.log(rowCheck)

      if (rowCheck) {

        const re_bl_photo = rowCheck.re_bl_photo;
  
        if (re_bl_photo == 0) {
            const updateQuery = 'UPDATE upload_photo SET ? WHERE id = ?';
            return db.query(updateQuery,[newData, id]);
        }
        else{
          return "re_bl_photo=100"
        }
      }
    
    } catch (error) {
        console.error(error)
        throw error
    }
}
