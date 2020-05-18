const bcryptjs = require('bcryptjs');
const router = require("express").Router();

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service");

router.post('/register', (req, res) => {
    const credentials = req.body;

    if(isValid(credentials)) {

        const rounds = process.env.BCRYPT_ROUNDS || 8;
        //hash the password
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        credentials.password = hash;
        
        
        //save user to database
        Users.add(credentials).then(user => {
            req.session.loggedIn === true;
            res.status(201).json({ data: user})
        })
        .catch(error => {
            res.status(500).json( {error: error.message });
        });
    } else {
        res.status(400).json({ message: 'please provide a username and password and password is string'})
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(isValid(req.body)) {

        Users.findBy({ username: username }).then(([user]) => {
            //compare password to hash in database
            if(user && bcryptjs.compareSync(password, user.password)){
                // we can save information about client inside the session (req.session)
                req.session.loggedin = true;
                res.session.user = user;
                res.status(200).json({ message: "Welcome to the API"});
            } else {
                res.status(401).json({ message: "Invalid Credentials"});
            }
        })
        .catch(error => {
            res.status(500).json( {error: error.message });
        });   
    } else {
        res.status(400).json({ message: 'please provide a username and password and password is string'})
    }
});

router.get("/logout", (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
            res.status(500).json({ message: "could not log out"})
            } else {
                res.status(204).end();
            }
        });
    } else {
        res.status(204).end();
    }
    });



module.exports = router;