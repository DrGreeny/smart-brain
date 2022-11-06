const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const { handleSignIn } = require("./controllers/signin");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "greeny",
    database: "'smart-brain'",
  },
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", signin.handleSignIn(db, bcrypt)); //alternative writing, see signin.js

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageUrl", (req, res) => {
  image.handleApiCall(req, res);
  console.log("imageUrl call done");
});

/* // Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});

bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
}); */
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
