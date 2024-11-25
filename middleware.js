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
    const userPhoneNumber = req.body.phoneNum;
    const adminNumbers = JSON.parse(process.env.ADMIN_NUMBERS);


    if (Object.values(adminNumbers).includes(userPhoneNumber)) {
        return next();
    }
    throw new ExpressError('관리자 핸드폰 번호가 아닙니다.', 401);
    // 여기에 보안 로직 구현 (예: 특정 IP에서만 접근 가능, 특별한 토큰 필요 등)
}