const express = require('express');
const router = express.Router();

const users = [
    {id: 1, name:"ali", username:"admin", age:19}
];

router.get("/", (req, res) => {
    res.send(users);
})

router.get("/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user)  return res.status(404).send("User with given id doesn't exist!")
    res.send(user);
})


module.exports = router;

