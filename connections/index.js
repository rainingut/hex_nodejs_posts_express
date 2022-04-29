const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: 'config.env'});

const DB = process.env.POSTDATABASE.replace('<password>', process.env.POSTPASSWORD);
mongoose.connect(DB)
  .then(() => console.log('DB connect Work!!!'))
  .catch(error => console.log(error));