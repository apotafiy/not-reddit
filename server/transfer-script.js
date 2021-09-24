// const sqlite3 = require('sqlite3').verbose();
// const { insertUser, insertPost } = require('./utils/db');

// const openDB = () => {
//   return new sqlite3.Database(
//     './database.db',
//     sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
//     (err) => {
//       if (err) {
//         console.error(err.message, err.stack);
//       }
//     }
//   );
// };
// const closeDB = (db) => {
//   db.close((err) => {
//     if (err) {
//       console.error(err.message, err.stack);
//     }
//   });
// };
// const getUsers = (db) => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM users', [], (err, row) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(row);
//     });
//   });
// };
// const getPosts = (db) => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM posts', [], (err, row) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(row);
//     });
//   });
// };
// async function transfer() {
//   try {
//     const db = openDB();
//     const posts = await getPosts(db);
//     const users = await getUsers(db);
//     posts.forEach((post) => {
//       const {
//         message_id,
//         user_id,
//         public_id,
//         version,
//         format,
//         resource_type,
//         created_at,
//         type,
//         secure_url,
//         upvotes,
//       } = post;
//       const obj = {
//         messageID: message_id,
//         userID: user_id,
//         publicID: public_id,
//         version,
//         format,
//         resourceType: resource_type,
//         createdAt: created_at,
//         type,
//         secureURL: secure_url,
//         upvotes,
//       };
//       //console.log('Post: ', obj);
//       //insertPost(obj);
//     });

//     users.forEach((user) => {
//       const { user_id, username, karma, num_posts } = user;
//       const obj = { userID: user_id, username, karma, postCount: num_posts };
//       //console.log('User: ', obj);
//       //insertUser(obj);
//     });

//     closeDB(db);
//   } catch (err) {
//     console.log(err);
//   }
// }
// async function test() {
//   try {
//     const db = openDB();
//     console.log(await getPosts(db));
//     console.log(await getUsers(db));
//     closeDB(db);
//   } catch (err) {
//     console.log(err);
//   }
// }
