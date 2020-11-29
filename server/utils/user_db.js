const sqlite = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

/** @module DatabaseConnection */


// Global Variable
let db;

var connect = function () {
    db = new sqlite.Database('./db/mynotes.db', (error) => {
        if (error) throw new Error(error.message)

    })

}

var close = function () {
    db.close((err) => {
        if (err) {
            console.log(err);
        }
    });
}
/**
 * Cehck if user exist in database if so return true otherwise false 
 *  @param {data}
 *  @returns Promise
 * 
*/

let userExists = function (data) {
    return new Promise((resolve, reject) => {
        db.get(`select * from users where login = ?`, [data.login], (err, row) => {

            if (err) {
                reject(err);
            }

            if(row == null || row == []){
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
    })



}

/**
 * Select all users from database 
 * 
 * $server:$PORT/user : gets @list of users || Debug ONLY
 */

let selectAll = function () {
    connect();
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM users`, [], (err, allrows) => {
            if (err) {
                reject(err);
            }
            resolve(allrows);
        });
        close()
    })

}

/**
 * Sign up user by login and password 
 *  @param {
 *      username : String,
 *      lastname: String,
 *      login: String,
 *      password: String,
 * }
 *  @returns Promise
 * 
*/

var signUpUser = function (data) {

    connect();
    return new Promise((resolve, reject) => {

        //First check is user exists

        userExists(data).then((state) => {
            console.log(state);
            if (state) {
                resolve("This user already exists");

            } else {
                // Hash the given password before storing into DB
                let hashedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
                db.run(`INSERT INTO users (username, lastname, login , password) VALUES (?, ?, ?, ?)`,
                    [data.username, data.lastname, data.login, hashedPassword], (err) => {
                        if (err) reject(err);

                        resolve("New User have been created!")
                    })
            }
            close()

        }).catch((e) => console.log(e))


    });

}

/**
 * Log in user by login and password 
 *  @param {
    *      username : String,
    *      lastname: String,
    *      login: String,
    *      password: String,
    * }
    *  @returns Promise
    * 
   */

var LogInUser = function (data) {
    connect();
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE login = ?`,
            [data.login], (err, row) => {
                if (err) {
                     reject(err) 
                } 
                if (row !== undefined){
                //Check if password match hashed version
                var validatePassword = bcrypt.compareSync(data.password, row.password);

                if(!validatePassword){
                    //Send appropriate rejection
                    reject("Incorrect Password");
                }
                resolve(row)
            } else {
                reject("Username Does Not Exists")
            }
            })
        close()
    });

}


// Debugging functions : ONLY DEBUG USE! || TEST 

let clearTable = function (name) {
    connect();
    db.run(`delete from users where login = ?`, [name], (err) => {
        if (err) throw err;
    })

    close()
}



module.exports = {
    connect,
    selectAll,
    signUpUser,
    LogInUser,
    clearTable,
    close
}