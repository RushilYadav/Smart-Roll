const express = require('express');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});