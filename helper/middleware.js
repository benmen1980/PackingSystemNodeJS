exports.adminAuthentication = function (req, res, next) {
    if (req.cookies.role && req.cookies.role === "admin") {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

exports.userAuthentication = function (req, res, next) {
    if (req.cookies.role && req.cookies.role === "user") {
        next();
    } else {
        res.redirect('/');
    }
}