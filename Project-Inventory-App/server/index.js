const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/router");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use(
  "/uploads",
  (req, res, next) => {
    console.log("accessing image");
    next();
  },
  express.static(path.join(__dirname, "static/uploads"), {
    maxAge: "30d",
    immutable: true,
  })
);

app.use("/api", router);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.....`);
});
