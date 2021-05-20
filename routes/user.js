var express = require('express');
var router = express.Router();
const { userAuthentication } = require('../helper/middleware');

router.get('/home', userAuthentication, (req, res, next) => {
    res.render('user/home', {
        username: req.cookies.username,
        packingSystemLabel: res.__('Packing system'),
        pLabel: res.__('P'),
        Logoff: res.__('Logoff'),
        scanBasketLabel: res.__('Scan basket'),
        scanItemLabel: res.__('Scan Item'),
        numberOfPacksLabel: res.__('Number of packs'),
        completeLabel: res.__('Complete'),
        suspendedLabel: res.__('Suspended'),
        printingAndProcessingLabel: res.__('Printing and processing...'),
    });

})
router.get('/logout', (req, res, next) => {
    res.clearCookie('role');
    res.clearCookie('username');

    res.redirect('/');

})
module.exports = router;
