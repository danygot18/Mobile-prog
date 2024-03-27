const User = require('../models/user');
const sendToken = require('../routes/jwtToken');

exports.register = async (req, res, next) => {

    try {

        const file = req.file;
        const fileName = file.filename;

        if (!file) return res.status(400).send('No image in the request');

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        req.body.image = `${basePath}${fileName}`

        const user = await User.create(req.body)

        if (!user) {
            return res.status(400).send('the user cannot be created!')
        }

        return sendToken(user, 200, res, 'Success');

    } catch (err) {
        return res.status(400).json({
            message: 'Please try again later',
            success: false,
        })
    }
}

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter email & password' })
        }

        let user = await User.findOne({ email }).select('+password');


        if (!user) {
            return res.status(400).json({ message: 'Invalid Email or Password' });
        }

        const passwordMatched = await user.comparePassword(password);

        if (!passwordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' })
        }

        user = await User.findOne(user._id);

        sendToken(user, 200, res)

    } catch (err) {
        return res.status(400).json({
            message: 'Please try again later',
            success: false,
        })
    }

}
exports.Logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

exports.Profile = async (req, res, next) => {
    // console.log(req.header('authorization'))
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
}

exports.UpdateProfile = async (req, res, next) => {
    try {
        const file = req.file;
        if (file) {
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            req.body.image = `${basePath}${file.filename}`;

        }

        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(401).json({ message: 'User Not Updated' });
        }

        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Failed to update user profile' });
    }
};

exports.getUser = async (req, res) => {
    const user = await User.find();

    if (!user) {
        req.status(500).json({ success: false })
    }
    res.status(200).send(user);
}