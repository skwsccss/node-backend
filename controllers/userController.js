var User = require('../models/users');
var shortid = require('shortid');
const jwt = require('jsonwebtoken');
var avatarUpload = require('../libs/avatarUpload');

class userController {

    constructor() {

    }

    async getUserList(req, res) {
        let users = await User.find({});
        if (!users) {
            users = [];
        } else {
            users = users.map(user => { return { userID: user.userID, username: user.username, amount: user.amount } })
        }

        res.json({ status: true, users: users });
    }

    async signup(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (!username || !password) {
            res.json({ status: false, message: 'Request parameters are not valid.' })
        } else {
            User.findOne({ username: username }, (err, user) => {
                if (user) {
                    res.json({ status: false, message: 'This username is already taken.' });
                } else {
                    let newUser = new User();
                    newUser.userID = shortid.generate()
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(err => {
                        if (err) res.json({ status: false, message: 'Cannot save new user.' });
                        else {
                            res.json({ status: true, message: 'successfully added new user' });
                        }
                    })
                }
            })
        }
    }

    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (!username || !password) {
            username = username.toLowerCase();
            res.json({ status: false, message: 'Request parameters are not valid.' })
        } else {
            User.findOne({ username: username }, (err, user) => {
                if (err) res.json({ status: false, message: 'Database error.' });
                else {
                    if (user) {
                        if (!user.validPassword(password)) {
                            res.json({ status: false, message: 'Wrong Password.' });
                        } else {
                            let jwtSignData = {
                                userID: user.userID,
                                username: user.username,
                            };
                            let jwtSignOptions = {
                                expiresIn: process.env.JWT_EXPIRETIME,
                                algorithm: process.env.JWT_ALGORITHM
                            };
                            let authToken = jwt.sign(jwtSignData, process.env.JWT_SECRET, jwtSignOptions);
                            res.json({ status: true, username: user.username, userID: user.userID, token: authToken, amount: user.amount });
                        }
                    } else {
                        res.json({ status: false, message: username + ' does not exist.' });
                    }
                }
            })
        }
    }

    async getUserData(req, res) {
        let userID = req.body.userID;
        let user = await User.findOne({ userID: userID });
        let avatar = (user.avatar) ? process.env.SERVER_URL + '/images/' + user.avatar : '';
        res.json({ amount: user.amount, username: user.username, description: user.description, avatar: avatar });
    }

    async updateUserData(req, res) {
        let userID = req.body.userID;
        let amount = req.body.amount;
        let description = req.body.description ? req.body.description : '';
        let uploadpath = null;
        if (req.body.file != 'null') {
            uploadpath = await avatarUpload(req);
        }
        let updatedata = {};
        if (uploadpath) {
            updatedata = {
                amount: amount,
                description: description,
                avatar: uploadpath
            }
        } else {
            updatedata = {
                amount: amount,
                description: description,
            }
        }
        await User.updateOne({ userID: userID }, updatedata);
        res.json({ status: true });
    }

    getAssets(req, res) {
        let fileName = req.params.fileName;
        let path = process.cwd() + '/public/images/' + fileName;
        res.download(path);
    }
}

module.exports = userController;