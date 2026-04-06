const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/router");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
const passport = require("./middleware/passport.js");
const cookieParser = require("cookie-parser");

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Serve uploaded images
app.use(
  "/api/static/uploads",
  (req, res, next) => {
    console.log("accessing image");
    next();
  },
  express.static(path.join(__dirname, "static/uploads"), {
    maxAge: "30d",
    immutable: true,
  }),
);

app.use("/api", router);

app.use((err, req, res, next) => {
  // 1. Log the error for you (the developer) in the terminal
  console.error("--- Server Error ---");
  console.error(err.message);

  // 2. If the error happened during the Google Callback, send them to React
  if (req.path.includes("/auth/google/callback")) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/signin?error=database_error`,
    );
  }

  // 3. Fallback for any other random errors in your app
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.....`);
});
