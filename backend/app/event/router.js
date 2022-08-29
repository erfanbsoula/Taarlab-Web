const express = require('express');
const router = express.Router();

router.post('/api/report', (req, res) => {
    console.log(req.body);
    res.send("done!")
})

module.exports.router = router;
