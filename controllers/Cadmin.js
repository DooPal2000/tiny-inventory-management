const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderAdmin = async (req, res) => {
    const users = await User.find({}).select('-password'); // user role만 담고 password 제외
    // const users = await User.find({ role: 'user' }).select('-password'); // user role만 담고 password 제외

    res.render('admin/admin', { users: users});
};
