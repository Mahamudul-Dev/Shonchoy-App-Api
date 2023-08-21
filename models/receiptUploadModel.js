const { db } = require("../config/dbConfig");

module.exports.upload = async (
  so_code,
  serial,
  sodosso_name,
  file_name,
  time,
  photo_status
) => {
  try {
    const insertQuery = "INSERT INTO upload_photo (so_code, serial, sodosso_name, file_name, time, photo_status) VALUES (?, ?, ?, ?, ?, ?)";
    return db.query(insertQuery, [so_code, serial, sodosso_name, file_name, time, photo_status]);
  } catch (error) {
    console.error(error);
  }
};
