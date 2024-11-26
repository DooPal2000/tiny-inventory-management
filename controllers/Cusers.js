const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};
module.exports.renderRegisterAdmin = (req, res) => {
    res.render('users/registerAdmin');
};

module.exports.register = async (req, res) => {
    const { phonenum, password } = req.body;
    //await User.deleteMany({ username: username });

    const user = new User({
        phonenum,
        isActive: false,
    });
    const registerUser = await User.register(user, password);
    res.redirect('/home');
};

module.exports.registerAdmin = async (req, res) => {
    const { phonenum, password } = req.body;

    const user = new User({
        phonenum,
        role: 'admin' // role을 'admin'으로 설정
    });

    const registerUser = await User.register(user, password);
    req.login(registerUser, err => {
        if (err) return next(err);
        res.redirect('/admin-dashboard'); // 관리자 대시보드로 리다이렉트
    });
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    let redirectUrl = res.locals.returnTo || '/home';
    console.log(req.user);
    // 사용자 역할이 'admin'인 경우 관리자 페이지로 리다이렉트
    if (req.user && req.user.role === 'admin') {
        redirectUrl = '/admin-dashboard'; // 관리자 대시보드 URL
    }

    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

  
module.exports.logout = (req, res, next) => {

    req.logout(function (err) {

        if (err) {

            return next(err);

        }


        res.redirect('/home');

    });
}

module.exports.searchFavorite = async (req, res) => {
    const currentUser = req.user;

    // favorites 배열의 fixtureId를 사용하여 Fixture를 조회
    const favorites = await Fixture.find({
        'fixture.fixtureId': { $in: currentUser.favorites }
    });
    const favoriteFixtureIds = currentUser.favorites;


    res.json(favoriteFixtureIds);
};

module.exports.addFavorite = async (req, res) => {
    const currentUser = req.user;
    const fixtureId = parseInt(req.params.fixtureId);

    if (!currentUser.favorites.includes(fixtureId)) {
        currentUser.favorites.push(fixtureId);
        await currentUser.save();
    }

    console.log(currentUser.favorites);
    res.json({ success: true, message: '즐겨찾기에 추가되었습니다.' });
};

module.exports.deleteFavorite = async (req, res) => {
    const currentUser = req.user;
    const fixtureId = parseInt(req.params.fixtureId);

    // favorites 배열에서 해당 fixture의 _id를 제거
    currentUser.favorites = currentUser.favorites.filter(id => id !== fixtureId);
    await currentUser.save();

    // // favorites 배열에서 해당 fixture의 _id를 제거
    // currentUser.favorites = currentUser.favorites.filter(id => !id.equals(fixture._id));
    // await currentUser.save();

    console.log(currentUser.favorites);
    res.send(currentUser);
};


