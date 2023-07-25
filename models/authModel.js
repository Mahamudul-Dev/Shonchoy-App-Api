const {db} = require('../config/dbConfig');

module.exports.getUser = (userName, password) => {
    console.log(userName)

    try {
        return db.execute('SELECT * FROM member_profile WHERE user = ? AND password = ?', [userName, password]);
      } catch (error) {
        console.error(error);
        throw error;
      }
}
