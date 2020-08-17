const express = require('express');
const authController = require('../controllers/auth');
const actController = require('../controllers/Activity')


const router = express.Router();

//User auth
router.post('/register', authController.register);
router.post('/otpverify',authController.otpverify);
router.post('/resendcode',authController.resendcode);
router.post('/resetpass',authController.resetpass);
router.post('/forgotpass',authController.forgotpass);
router.post('/forgototp',authController.forgototp);
router.post('/forotpresend',authController.forotpresend);

//User Activities
router.post('/login', actController.login);
router.post('/profile', actController.profile);
router.post('/mypage', actController.mypage);
router.post('/spin', actController.spin);
router.post('/changepass', actController.changepass);
router.post('/contact', actController.contact);
router.post('/delete', actController.delete);
router.post('/topplayers', actController.topplayers);
//router.post('/weektop', actController.weektop);

module.exports = router;