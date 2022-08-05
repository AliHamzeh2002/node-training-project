const express = require("express");
const app = express();
app.use(express.json());

const users = [
    {name: "ali", id: 1},
    {name: "hossein", id: 2}
];

let available_id = 3;

app.get("/", (req, res) => {
    res.send("TEST");
});

app.get("/api/users", (req, res) => {
    res.send([1,2,3,4]);
});

app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user)  res.status(404).send(`user with this id ${req.params.id} not found`);
    res.send(user);
})

app.post("/api/users", (req, res) => {
    const user = {
        name: req.body.name, id: available_id
    };
    available_id++;
    users.push(user);
    res.send(user);
})

const port = process.env.PORT ?? 3000; 

app.listen(port, () => console.log(`STARTED ON PORT ${port}`));