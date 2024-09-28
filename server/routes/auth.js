const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('../models/User');

/* configuration Multer for file upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // save file in public/uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // save file with original filename
    },
});

const upload = multer({ storage });

/* USER REGISTER */
router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        // take all the info
        const { firstName, lastName, email, password } = req.body;

        // the uploaded file is available as req.file
        const profileImage = req.file;
        if (!profileImage) {
            return res.status(400).send('You need a profile image to register.');
        }

        // path to the uploaded profile photo
        const profileImagePath = profileImage.path;
        // if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User Already Exists.' });
        }

        // hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath,
        });

        // save the new user
        await newUser.save();
        // send a success response
        res.status(200).json({
            message: 'User Registration Successfully',
            user: newUser,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'User Registration Failed!',
            error: err.message,
        });
    }
});

/* USER LOGIN*/
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: 'User Does Not Exists.' });
        }

        // compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Wrong Password!',
            });
        }

        // generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
