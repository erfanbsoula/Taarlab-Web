const express = require('express');
const client = require('../database.js').client;
const router = express.Router();

router.use('/get-user', (req, res) => {
    client.db("test").collection("users").findOne({username:"erfan"}, (err, result) => {
        let img = Buffer.from(result.profilePic.data, "base64");
        res.setHeader('Content-Type', result.profilePic.contentType)
        res.send(img);
    })
})

module.exports.router = router;
