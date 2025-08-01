const express = require('express');
const userRouter = require('./routes/User');
const commentRouter = require('./routes/Comment');

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/users', userRouter);
app.use('/comments', commentRouter);


app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})