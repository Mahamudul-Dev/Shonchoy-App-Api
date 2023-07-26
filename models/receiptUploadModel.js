const {db} = require('../config/dbConfig')

module.exports.upload = (so_code, serial, sodosso_name, file_name, time, photo_status) => {
    console.log(so_code)

    try {
        return db.execute(
            'INSERT INTO upload_photo(so_code, serial, sodosso_name, file_name, time, photo_status) VALUES (?,?,?,?,?,?)', [so_code, serial, sodosso_name, file_name, time, photo_status])
    } catch (error) {
        console.error(error)
        throw error
    }
}
