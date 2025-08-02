const express = require('express');
const app = express();
const cors = require('cors');
const messagesRouter = require('./routes/Messages');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/messages', messagesRouter);

app.listen(PORT, (err) => {
  console.log(`Server running on http://localhost:${PORT}/`);
})