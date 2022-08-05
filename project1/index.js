const express = require("express");
const app = express();
const users = require("./routes/users");

app.use(express.json());
app.use("/api/users", users);

const port = process.env.PORT ?? 3000; 

app.listen(port, () => console.log(`listening to port ${port}`));