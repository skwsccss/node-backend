var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var user = new userController();

router.get('/', (req, res) => {res.send('Hello');});
router.get('/userlist', user.getUserList);
router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/getUserData', user.getUserData);
router.post('/updateUserData', user.updateUserData);
// router.get('/assets/:fileName', user.getAssets);

module.exports = router;
