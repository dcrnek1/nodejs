const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/users", userRouter);

app.listen(PORT, (error) => {
  error ? console.log(error) :
  console.log(`Server running at port ${PORT}...`);
})