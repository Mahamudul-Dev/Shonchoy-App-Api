const authModel = require('../models/authModel');


module.exports.login = async (req, res) => {

    try {
        const { userName, password } = req.body;
    
        // Check if the user exists in the database
        const user = await authModel.getUser(userName, password);
        console.log(user[0]);
        console.log(user[0].length === 0);
        if (user[0].length === 0 || !user[0]) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Passwords match, user is authenticated
        res.json({ message: 'Login successful', user: user[0] });
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
};
