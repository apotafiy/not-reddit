const pool = require('../db/database');

async function getAllPosts() {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM posts;';
    const result = await client.query(query);
    client.release();
    return result;
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function getAllUsers() {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM users;';
    const result = await client.query(query);
    client.release();
    return result;
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function getPost(messageID) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM posts WHERE messageID = $1;';
    const result = await client.query(query, [messageID]);
    client.release();
    return result;
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function getUser(userID) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM users WHERE userID = $1;';
    const result = await client.query(query, [userID]);
    client.release();
    return result;
  } catch (err) {
    console.error(err);
  }
  return null;
}

/**
 *
 * @param {object} param0 columns
 * @returns
 */
async function insertPost({
  messageID,
  userID,
  publicID,
  version,
  format,
  resourceType,
  createdAt,
  type,
  secureURL,
  upvotes,
}) {
  try {
    const client = await pool.connect();
    const query =
      'INSERT INTO posts (messageID, userID, publicID, version, format, resourceType, createdAt, type, secureURL, upvotes) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';
    await client.query(query, [
      messageID,
      userID,
      publicID,
      version,
      format,
      resourceType,
      createdAt,
      type,
      secureURL,
      upvotes,
    ]);
    client.release();
    console.log(`...post inserted into db at ${new Date().toString()}`);
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function insertUser({ userID, username, karma, postCount }) {
  try {
    const client = await pool.connect();
    const query =
      'INSERT INTO users (userID, username, karma, postCount) values ($1, $2, $3, $4);';
    await client.query(query, [userID, username, karma, postCount]);
    client.release();
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function initializeDB() {
  try {
    const client = await pool.connect();
    const createPostsQuery =
      'CREATE TABLE IF NOT EXISTS posts (messageID TEXT NOT NULL, userID TEXT NOT NULL, publicID TEXT NOT NULL, version TEXT NOT NULL, format TEXT NOT NULL, resourceType TEXT NOT NULL, createdAt TEXT NOT NULL, type TEXT NOT NULL, secureURL TEXT NOT NULL, upvotes INTEGER NOT NULL, FOREIGN KEY (userID) REFERENCES users (userID), PRIMARY KEY (messageID));';
    const createUsersQuery =
      'CREATE TABLE IF NOT EXISTS users (userID TEXT NOT NULL, username TEXT NOT NULL, karma INTEGER NOT NULL, postCount INTEGER NOT NULL, PRIMARY KEY (userID));';
    await client.query(createPostsQuery);
    await client.query(createUsersQuery);
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function updateUserKarma(userID, value) {
  try {
    const client = await pool.connect();
    const query = 'UPDATE users SET karma = karma + $1 WHERE userid = $2;';
    await client.query(query, [value, userID]);
    client.release();
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function incrementUserPostCount(userID) {
  try {
    // TODO: update methods arent working
    const client = await pool.connect();
    const query =
      'UPDATE users SET postCount = postCount + 1 WHERE userID = $1;';
    await client.query(query, [userID]);
    client.release();
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function updatePostKarma(messageID, value) {
  try {
    const client = await pool.connect();
    const query =
      'UPDATE posts SET upvotes = upvotes + $1 WHERE messageID = $2;';
    await client.query(query, [value, messageID]);
    client.release();
  } catch (err) {
    console.error(err);
  }
  return null;
}

module.exports = {
  getAllPosts,
  getAllUsers,
  getPost,
  getUser,
  insertUser,
  insertPost,
  initializeDB,
  updateUserKarma,
  updatePostKarma,
  incrementUserPostCount,
};
