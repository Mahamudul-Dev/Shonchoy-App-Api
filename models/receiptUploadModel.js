const {db} = require('../config/dbConfig')

module.exports.upload = (id, so_code, serial, sodosso_name, file_name, time, photo_status) =>{
    console.log(collectionDay,soCode)

    try {
        return db.execute(
            'INSERT INTO upload_photo(id, so_code, serial, sodosso_name, file_name, time, photo_status) VALUES (?,?,?,?,?,?,?)', [id, so_code, serial, sodosso_name, file_name, time, photo_status])
    } catch (error) {
        console.error(error)
        throw error
    }
}
