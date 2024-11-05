const User = require('../db.js');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const user = await User
            .findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user
        const newUser = await User.create({ email, password });

        // Generate token
        const token = newUser.generateToken();

        res.status(201).json({ token: token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = user.generateToken();

        res.status(200).json({ token: token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    login,
    register
 };