const express = require("express");
const cors = require("cors");
const app = express();
const port = 3080;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Le serveur tourne sur le port " + port);
});
