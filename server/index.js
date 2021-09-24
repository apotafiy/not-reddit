const express = require('express');
const { botLogin } = require('../bot/bot');
const { getAllUsers, getAllPosts, initializeDB } = require('./utils/db');

const PORT = process.env.PORT || 5000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello heroku');
});
app.get('/api/db/users', async (req, res) => {
  try {
    const result = await getAllUsers();
    const users = result.rows;
    res.json(users);
  } catch (err) {
    console.error(err);
    res.send(`Error: ${err}`);
  }
});

app.get('/api/db/posts', async (req, res) => {
  try {
    const result = await getAllPosts();
    const posts = result.rows;
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.send(`Error: ${err}`);
  }
});

app.listen(PORT, async () => {
  try {
    console.log(`Listening on ${PORT}`);
    await initializeDB();
    botLogin();
  } catch (err) {
    console.error(err);
  }
});
