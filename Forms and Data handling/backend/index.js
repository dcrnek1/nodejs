const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/UserRouter');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

app.listen(PORT, (err) => {
  console.log(`Server running on http://localhost:${PORT}/`);
})

