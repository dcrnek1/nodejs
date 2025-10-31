const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/router');
dotenv.config();

const app = express();
app.use('/uploads', (req, res, next) => {console.log("accessing image"); return next()}, express.static('./static/uploads', {
  maxAge: '30d',
  immutable: true,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
