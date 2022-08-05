const express = require("express");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use("/api/users", users);

const port = process.env.PORT ?? 3000; 

app.listen(port, () => console.log(`listening to port ${port}`));