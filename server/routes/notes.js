//Init Express.Router()
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const { verifyToken } = require('../utils/helpers');

const { selectAllNotes, createNote, deleteNote, updateNote, sharedNote } = require('../utils/notes_db');


/*
    Middlewares to check if user owns a token
*/
router.get("/", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, user) => {
        if (err) {
            console.log(err);
        }
        selectAllNotes(user.row.id).then((val) => {
            res.send(val);
        })
    })


})

router.get("/note/:id", (req, res) => {
    let id = req.params.id;
    res.send(id);
})


router.get('/shared/:owner/:note', (req, res) => {
    let owner = req.params.owner;
    let note = req.params.note;

    sharedNote(owner, note).then((val) => {
        res.send(val)
    }).catch((e) => {
        res.sendStatus(404);
    })
});

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    deleteNote(id).then((val) => {
        res.status(200).send(val);
    }).catch((e) => {
        console.log(e);
    })
})


router.post('/:id/create', (req, res) => {
    let owner = req.params.id;
    let new_note = req.body;
    createNote(owner, {
        note: new_note.note,
        created: new_note.created,
        link: new_note.link
    }).then((val) => {
        res.status(200).send(val)
    }).catch((e) => {
        console.log(e);
    })
})


router.put("/:id/update", (req, res) => {
    let note_id = req.params.id;
    let updatedNote = req.body;

    updateNote(note_id, updatedNote).then((val) => {
        res.send(val);
    }).catch((e) => {
        console.log(e);
    })

})



module.exports = router;
