const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/dbconfig");

const port = process.env.PORT || 4000;

// CORS Handling Middleware
app.use(cors());

// Request Parsing Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");

// Route Middlewares
app.use("/api/auth", authRoutes);

// Database Connection
db.authenticate()
  .then(() => {
    console.log("Database Connected !");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log("Server Started On PORT: " + port);
});
