// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected for collaboration service"))
  .catch(err => console.error(err));


app.use('/api/chat',chatRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Collaboration service running on port ${PORT}`);
});



