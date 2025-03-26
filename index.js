const express = require("express");
const app = express();
const cors = require("cors");

//Routers
const interactRouter = require("./server/routes/interaction");

//Db
require("./server/db/mongoose");

//Dev mode: 5000-> Backend, 3000-> Frontend
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

app.use(interactRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
