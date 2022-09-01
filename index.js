const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const users = require("./routes/users").router;
const posts = require("./routes/posts").router;
const likes = require("./routes/likes").router;


const app = express();

app.use(express.json());
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/likes", likes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


const port = process.env.PORT ?? 3000; 

mongoose.connect("mongodb://localhost/testdb")
    .then(() => console.log("connected to the db"))
    .catch((err) => console.log("something went wrong while connecting to the db", err));

app.listen(port, () => console.log(`listening to port ${port}`));