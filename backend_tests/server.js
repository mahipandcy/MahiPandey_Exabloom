const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const conversationsRoute = require('./routes/conversations');

app.use(cors());
app.use(express.json());
app.use('/conversations', conversationsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
