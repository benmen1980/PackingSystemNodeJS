var express = require('express');
var router = express.Router();
const { userAuthentication } = require('../helper/middleware');
const { axiosFunction } = require('../helper/helper');

router.get('/home', userAuthentication, (req, res, next) => {

    const date = new Date();
    // const listPalletNumbertUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/QAMR_PALLET2?$filter=CURDATE ge ${date.toISOString()}&$select=PALLETNUM,STCODE,STDES,CURDATE`;
    const listPalletNumbertUrl = `https://pri.paneco.com/odata/Priority/tabula.ini/a190515/QAMR_PALLET2?$filter=CURDATE%20ge%202021-05-01T09:59:00%2B02:00 and SENTTODRIVER ne 'Y'&$select=PALLETNUM,STCODE,STDES,SENTTODRIVER ,CURDATE`;
    axiosFunction(listPalletNumbertUrl, 'get')
        .then(palletNoList => {
            res.render('user/home', {
                palletNo: palletNoList.value,
                username: req.cookies.username,
                packingSystemLabel: res.__('Packing system'),
                pLabel: res.__('P'),
                Logoff: res.__('Logoff'),
                palletNoLabel: res.__('Pallet No.'),
                distributionNumberLabel: res.__('Distribution Number'),
                scanBasketLabel: res.__('Scan basket'),
                scanItemLabel: res.__('Scan Item'),
                numberOfPacksLabel: res.__('Number of packs'),
                completeLabel: res.__('Complete'),
                suspendedLabel: res.__('Suspended'),
                printingAndProcessingLabel: res.__('Printing and processing...'),
                packNumberLabel: res.__('Pack Number'),
                closeinvoiceLabel: res.__('Close invoice'),
                CloseInvoiceInProgressLabel: res.__('Close invoice in-progress'),
                printInvoiceLabel: res.__('Print invoice')
            });
        })
        .catch((error) => {
            res.render('user/home', {
                palletNo: [],
                username: req.cookies.username,
                packingSystemLabel: res.__('Packing system'),
                pLabel: res.__('P'),
                Logoff: res.__('Logoff'),
                palletNoLabel: res.__('Pallet No.'),
                distributionNumberLabel: res.__('Distribution Number'),
                scanBasketLabel: res.__('Scan basket'),
                scanItemLabel: res.__('Scan Item'),
                numberOfPacksLabel: res.__('Number of packs'),
                completeLabel: res.__('Complete'),
                suspendedLabel: res.__('Suspended'),
                printingAndProcessingLabel: res.__('Printing and processing...'),
                packNumberLabel: res.__('Pack Number'),
                closeinvoiceLabel: res.__('Close invoice'),
                CloseInvoiceInProgressLabel: res.__('Close invoice in-progress'),
                printInvoiceLabel: res.__('Print invoice')
            });
        })
})

router.get('/logout', (req, res, next) => {
    res.clearCookie('role');
    res.clearCookie('username');

    res.redirect('/');

})
module.exports = router;
