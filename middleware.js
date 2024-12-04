const { user } = require('./models/user.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    console.log("Req.user...", req.user)
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', '로그인 해 주세요.')
        return res.redirect('/login');
    }
    next();
}


module.exports.isAuthorized = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isActive) {
        return next();
    }
    req.flash('error', '활성화된 고객님이 아닙니다. 관리자에게 문의해 주세요.');
    res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error', '로그인 해 주세요.')
    throw new ExpressError('관리자가 아닙니다.', 401);
};

module.exports.isSecureAdminCreation = (req, res, next) => {
    // 여기에 보안 로직 구현 (예: 특정 IP에서만 접근 가능, 특별한 토큰 필요 등)
    const userPhoneNumber = req.body.phonenum;
    const adminNumbers = JSON.parse(process.env.ADMIN_NUMBERS);


    if (Object.values(adminNumbers).includes(userPhoneNumber)) {
        return next();
    }
    throw new ExpressError('관리자 핸드폰 번호가 아닙니다.', 401);
}