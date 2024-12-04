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
    if (!req.isAuthenticated() || !req.user.isActive) {
        req.flash('error', '활성화된 고객님이 아닙니다. 관리자에게 문의해 주세요.');
        return res.redirect('/login');
    }
    next();
};


module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        req.flash('error', '관리자가 아닙니다.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isSecureAdminCreation = (req, res, next) => {
    const userPhoneNumber = req.body.phonenum;
    const adminNumbers = JSON.parse(process.env.ADMIN_NUMBERS);

    if (!Object.values(adminNumbers).includes(userPhoneNumber)) {
        req.flash('error', '관리자 계정 생성이 불가합니다.');
        return res.redirect('/unauthorized');
    }
    next();
};
