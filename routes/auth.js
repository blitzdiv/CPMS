const express = require('express');
const authController = require('../controller/auth');
const router = express.Router();


//send data from server to database
//whenever route get an specified url, it calls function in auth.js in controller folder
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotpassword);
router.post('/authorRegistration', authController.authorRegistration);
router.post('/reviewerRegistration', authController.reviewerRegistration);
//router.post('/reviewersCommentReport', authController.delete);
router.post('/paperSubmit', authController.paperSubmit);
router.post('/paperReview', authController.paperReview);
router.post('/authorAccount', authController.authorAccount);
router.put('/authorAccount', authController.authorAccount);







module.exports = router;
