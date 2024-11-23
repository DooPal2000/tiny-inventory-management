const { user } = require('./models/user.js');
const ExpressError = require('./utils/ExpressError.js');


module.exports.isAuthorized = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isActive) {
        return next();
    }
    res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied');
};

module.exports.isSecureAdminCreation = (req, res, next) => {
    // 여기에 보안 로직 구현 (예: 특정 IP에서만 접근 가능, 특별한 토큰 필요 등)
}