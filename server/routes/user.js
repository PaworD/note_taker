//Init Express.Router()
const express =  require('express');
const router  =  express.Router();
const jwt = require("jsonwebtoken");


//Import DB Utility Functions from ./Utils

const { verifyToken } = require('../utils/helpers');
const {selectAll, signUpUser, LogInUser, clearTable} = require("../utils/user_db.js")

router.get("/", (req, res) => {
    
    selectAll().then((val) => {
    res.status(200).send(val);
    })


})


router.get('/token', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, user) => {
        if(err) {
            console.log(err);
        }
        console.log(user.row);
             res.json({
                 data: user.row
             })
    })
})

router.post("/login", (req, res) => {
   var user = req.body;

   LogInUser({
       login: user.login,
       password: user.password
   }).then((row) => {
       if (row === undefined || row === []){
           res.status(401).send()
       } else {
        jwt.sign({row}, 'secretkey', {expiresIn: '30m'}, (err, token) => {
        res.json({
            token: token,
            data: row
        })   
        })
       }
   }).catch((e) => {
        res.status(401).send(e)
   })


})

router.post("/signup", (req, res) => {
    var user = req.body;
    signUpUser({
        username: user.username,
        lastname: user.lastname,
        login: user.login,
        password: user.password
    }).then((val) => {
       res.status(200).send(val);
    }).catch((e) => console.log(e))
})

router.get("/clear", (req, res) => {
    clearTable();
    res.send("Table Cleared")
})

router.get("/logout", (req, res) => {
    res.send("Log Out");
});



module.exports = router;
