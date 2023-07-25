const authModel = require('../models/authModel');


module.exports.login = async (req, res) => {

    try {
        const { userName, password } = req.body;
    
        // Check if the user exists in the database
        const user = await authModel.getUser(userName, password);
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        // Passwords match, user is authenticated
        res.json({ message: 'Login successful', user: user[0] });
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
};
