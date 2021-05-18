var express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
var router = express.Router();
const { adminAuthentication } = require('../helper/middleware');

router.get('/login', (req, res, next) => {
    res.render('admin/login', {
        errorResp: false,
        packingSystemLabel: res.__('Packing system'),
        pLabel: res.__('P'),
        backToHomePageLabel: res.__('Back to HomePage'),
        adminLoginLabel: res.__('Admin Login'),
        usernameLabel: res.__('Username'),
        loginLabel: res.__('Login'),
        errorMessageLabel: res.__('Enter your valid credential.')
    });

})

router.post('/login', function (req, res, next) {
    try {
        if (req.body.username === "roy123@gmail.com" && req.body.password === "roy123@") {
            res.cookie('role', "admin", { httpOnly: true });
            res.redirect('/admin/add_user');
        }
        else {
            res.render('admin/login', {
                errorResp: true,
                packingSystemLabel: res.__('Packing system'),
                pLabel: res.__('P'),
                backToHomePageLabel: res.__('Back to HomePage'),
                adminLoginLabel: res.__('Admin Login'),
                usernameLabel: res.__('Username'),
                loginLabel: res.__('Login'),
                errorMessageLabel: res.__('Enter your valid credential.')
            });
        }
    } catch (error) {
        res.render('admin/login', {
            errorResp: true,
            packingSystemLabel: res.__('Packing system'),
            pLabel: res.__('P'),
            backToHomePageLabel: res.__('Back to HomePage'),
            adminLoginLabel: res.__('Admin Login'),
            usernameLabel: res.__('Username'),
            loginLabel: res.__('Login'),
            errorMessageLabel: res.__('Enter your valid credential.')
        });
    }
});

router.get('/add_user', adminAuthentication, (req, res, next) => {
    res.render('admin/add_user', {
        errorResp: false, successResp: false, message: '',
        packingSystemLabel: res.__('Packing system'),
        pLabel: res.__('P'),
        logoutLabel: res.__('Logout'),
        addUserLabel: res.__('Add User'),
        usernameLabel: res.__('Username'),
        errorMessageLabel: res.__('Enter your valid credential.')
    });

})

router.get('/logout', (req, res, next) => {
    res.clearCookie('role');
    res.redirect('/admin/login');

})

router.post('/add_user', adminAuthentication, async (req, res, next) => {
    try {
        fs.readFile('./helper/manageUser.json', 'utf8', function (err, data) {
            if (err) {
                res.render('admin/add_user', {
                    errorResp: true, successResp: false,
                    packingSystemLabel: res.__('Packing system'),
                    pLabel: res.__('P'),
                    logoutLabel: res.__('Logout'),
                    addUserLabel: res.__('Add User'),
                    usernameLabel: res.__('Username'),
                    errorSuccessMessageLabel: res.__('Error while updating the data')
                });
            } else {
                obj = JSON.parse(data);

                const returnUser = obj.users.some((element) => {
                    return element.username == (req.body.username).toLowerCase();
                });

                if (returnUser) {
                    res.render('admin/add_user', {
                        errorResp: true, successResp: false,
                        packingSystemLabel: res.__('Packing system'),
                        pLabel: res.__('P'),
                        logoutLabel: res.__('Logout'),
                        addUserLabel: res.__('Add User'),
                        usernameLabel: res.__('Username'),
                        errorSuccessMessageLabel: res.__('User already exist')
                    });
                } else {
                    obj.users.push({
                        username: req.body.username.toLowerCase(), password: bcrypt.hashSync(req.body.password, 10), role: 'user'
                    });
                    json = JSON.stringify(obj);
                    fs.writeFileSync('./helper/manageUser.json', json, 'utf8');
                    res.render('admin/add_user', {
                        errorResp: false, successResp: true,
                        packingSystemLabel: res.__('Packing system'),
                        pLabel: res.__('P'),
                        logoutLabel: res.__('Logout'),
                        addUserLabel: res.__('Add User'),
                        usernameLabel: res.__('Username'),
                        errorSuccessMessageLabel: res.__('User Added Successfully')
                    });
                }
            }
        });

    } catch (error) {
        res.render('admin/add_user', {
            errorResp: true, successResp: false,
            packingSystemLabel: res.__('Packing system'),
            pLabel: res.__('P'),
            logoutLabel: res.__('Logout'),
            addUserLabel: res.__('Add User'),
            usernameLabel: res.__('Username'),
            errorSuccessMessageLabel: res.__('Error while updating the data')
        });
    }
})

module.exports = router;
