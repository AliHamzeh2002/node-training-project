const express = require("express");
const users = require("./routes/users").router;
const posts = require("./routes/posts").router;
const likes = require("./routes/likes").router;

const app = express();

app.use(express.json());
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/likes", likes);

const port = process.env.PORT ?? 3000; 

app.listen(port, () => console.log(`listening to port ${port}`));