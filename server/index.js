const express = require('express');
const transfer = require('./transfer-script');

const PORT = process.env.PORT || 5000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello heroku');
});
app.listen(PORT, async () => {
  try {
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    console.error(err);
  }
});

// when server start must run these sorts of commands
// const query ='CREATE TABLE IF NOT EXISTS dings (id SERIAL NOT NULL, week_day text NOT NULL, month_date integer NOT NULL, month text NOT NULL, year integer NOT NULL, time text NOT NULL, doorbot_description text NOT NULL, kind text NOT NULL, detection_type text NOT NULL, PRIMARY KEY (id))';
