const sqlite = require("sqlite3").verbose();
const {v4: uuidv4} = require('uuid');


/** @module DatabaseConnection */


// Global Variable
let db;

var connect = function(){
    db = new sqlite.Database('./db/mynotes.db', (error) => {
        if (error) throw new Error(error.message)

    })

}

var close = function(){
    db.close((err)=> {
        if (err) {
            throw err;
        }
    });
}

/**
 * Select all Notes of user whose id passed by @var owner 
 *  @param owner
 *  @returns Promise
 * 
*/

let selectAllNotes = function(owner){
    connect();
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM notes WHERE owner = ?`, [owner], (err, allrows) => {
            if (err){
                reject(err);
            }
            resolve(allrows);
        });
        close()
    })
   
}

/**
 * Create new Note with unique id and takes userId as foreignKey
 *  @param {owner, data}
 *  @returns Promise
 * 
*/

let createNote = function(owner, data){
    connect();
    return new Promise((resolve, reject) => {
        let id = uuidv4();
        
        let link = `http://localhost:8080/#/shared/note/${owner}/${id}`;
        db.run(`INSERT INTO notes (id, note, created, link, owner) VALUES (?, ?, ?, ?, ?)`,
        [id, data.note, data.created, link, owner], (err) =>{
            if(err) reject(err);

            resolve("New Note has been created!")
        })
        close()
    })
}

/**
 * Delete particular note from notes.public
 *  @param id
 *  @returns Promise
 * 
*/


let deleteNote = function(id) {
    connect();
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM notes WHERE id=?`, id, function(err) {
            if (err) {
              reject(err)
            }
            resolve("Succesfully Deleted!");
          });
          close();
    })
}

let updateNote = function(id, data){
    connect();
    return new Promise((resolve, reject) => {
        db.run('UPDATE notes SET note = ?, modified = ? WHERE id = ?', [data.note, data.modified, id], (err) => {
            if(err) {
                reject(err);
            }

            resolve("Succesfully Updated!")
        })
        close();
    })
}


let sharedNote = function(owner, note){
    connect();
    return new Promise((resolve, reject) => {
        db.get(`SELECT note FROM notes where owner = ? AND id = ?`, [owner, note], (err, row) => {
            if (err) {
                reject(err)
            }

            resolve(row);
        })
    })
}

let clearTable = function (note) {
    connect();
    db.run(`delete from notes where note = ?`, [note], (err) => {
        if (err) throw err;
    })

    close()
}




module.exports = {
    connect,
    close,
    selectAllNotes,
    createNote,
    deleteNote,
    updateNote,
    sharedNote,
    clearTable
}