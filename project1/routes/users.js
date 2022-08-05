const express = require('express');
const router = express.Router();

const users = [
    {id: 1, name:"ali", username:"admin", age:19}
];

router.get("/", (req, res) => {
    res.send(users);
})


module.exports = router;

