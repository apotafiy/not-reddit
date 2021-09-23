require('dotenv').config();
const cloud = require('cloudinary');
const { Client } = require('discord.js');
const {
  getAllUsers,
  getPost,
  getUser,
  insertUser,
  insertPost,
  updateUserKarma,
  updatePostKarma,
  incrementUserPostCount,
} = require('../server/utils/db');

cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PREFIX = '.';
const MEME_CHANNELS = ['no-context', 'memes'];
const RESTRICTED_CHANNELS = [
  'internship-postings',
  'announcements',
  'newgrad-postings',
];
const VALID_UPVOTE_ID = ['864567120469688330', '864618748635643954']; // "⬆️" won't work because it is not custom. only use it as the actaul emote, not the name
const VALID_DOWNVOTE_ID = ['867441493156036628', '867943961141071882']; // "⬇"
const DEFAULT_UPVOTE = '⬆️';
const DEFAULT_DOWNVOTE = '⬇';
const BILLION = 1000000000;

const start = process.hrtime();
const client = new Client({ partials: ['MESSAGE', 'REACTION'] });
client.on('ready', () => {
  const end = process.hrtime();
  const nanoSeconds =
    end[0] * BILLION + end[1] - (start[0] * BILLION + start[1]);
  const ms = nanoSeconds / 1000000;
  console.log(`...it took ${client.user.username} ${ms}ms to get online`);
});

const msgHasOneAttach = (msg) => msg.attachments.size === 1;

const isMemeChannel = (msg) => MEME_CHANNELS.includes(msg.channel.name);

const isImage = (theURL) => {
  const url = theURL.toLowerCase();
  return url.endsWith('png') || url.endsWith('jpg') || url.endsWith('webp');
};

const createPostObj = (msg, upload) => {
  const message_id = msg.id;
  const user_id = msg.author.id;
  const {
    public_id,
    version,
    format,
    resource_type,
    created_at,
    type,
    secure_url,
  } = upload;
  const upvotes = 0;
  return {
    messageID: message_id,
    userID: user_id,
    publicID: public_id,
    version,
    format,
    resourceType: resource_type,
    createdAt: created_at,
    type,
    secureURL: secure_url,
    upvotes,
  };
};

const createUserObj = (msg) => {
  const userID = msg.author.id;
  const { username } = msg.author;
  const karma = 0;
  const postCount = 0;
  return { userID, username, karma, postCount };
};

const karmaGain = (react) => {
  let karma = false;
  if (
    VALID_UPVOTE_ID.includes(react.emoji.id) ||
    react.emoji.name === DEFAULT_UPVOTE
  ) {
    karma = 1;
  } else if (
    VALID_DOWNVOTE_ID.includes(react.emoji.id) ||
    react.emoji.name === DEFAULT_DOWNVOTE
  ) {
    karma = -1;
  }
  return karma;
};

// const getPost = (messageID, db) => {
//   return new Promise((resolve, reject) => {
//     db.get(
//       'SELECT * FROM posts WHERE messageID = ?',
//       [messageID],
//       (err, row) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(row);
//       }
//     );
//   });
// };

// const getAllUsers = (db) => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM users', [], (err, row) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(row); // WILL THIS CAUSE A BUG?
//     });
//   });
// };

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

// const addTablesToDB = (db) => {
//   // will need to do this in the server index.js
//   return new Promise((resolve, reject) => {
//     const CREATE_POSTS_TABLE_SQL =
//       'CREATE TABLE IF NOT EXISTS "posts" ("messageID"	TEXT NOT NULL,"userID"	TEXT NOT NULL,"publicID"	TEXT NOT NULL,"version"	INTEGER NOT NULL,"format"	TEXT NOT NULL,"resourceType"	TEXT NOT NULL,"createdAt"	TEXT NOT NULL,"type"	TEXT NOT NULL,"secureURL"	TEXT NOT NULL,"upvotes"	INTEGER NOT NULL DEFAULT 0,PRIMARY KEY("messageID"),FOREIGN KEY("userID") REFERENCES "users"("userID"));';

//     const CREATE_USERS_TABLE_SQL =
//       'CREATE TABLE IF NOT EXISTS "users" ("userID"	TEXT,"username"	TEXT,"karma"	INTEGER DEFAULT 0,"postCount"	INTEGER DEFAULT 0,PRIMARY KEY("userID"));';
//     db.serialize(() => {
//       db.run(CREATE_POSTS_TABLE_SQL, [], (err) => {
//         if (err) {
//           reject(err);
//         }
//       }).run(CREATE_USERS_TABLE_SQL, [], (err) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve('...tables added to db');
//       });
//     });
//   });
// };

// const insertUser = (msg, db) => {
//   return new Promise((resolve, reject) => {
//     const userObj = createUserObj(msg);
//     const INSERT_USER_SQL =
//       'INSERT OR IGNORE INTO users(userID, username, karma, postCount) VALUES(?,?,?,?)';
//     db.run(
//       INSERT_USER_SQL,
//       [userObj.userID, userObj.username, userObj.karma, userObj.postCount],
//       (err) => {
//         if (err) {
//           console.error('...unable to insert user into db');
//           reject(err);
//         }
//         resolve('...user inserted in db');
//       }
//     );
//   });
// };

// const insertPost = (msg, upload, db) => {
//   return new Promise((resolve, reject) => {
//     const postObj = createPostObj(msg, upload);
//     const INSERT_POST_SQL =
//       'INSERT INTO posts(messageID, userID, publicID, version, format, resourceType, createdAt, type, secureURL, upvotes) VALUES(?,?,?,?,?,?,?,?,?,?)';
//     const params = Object.values(postObj);
//     db.serialize(() => {
//       db.run(INSERT_POST_SQL, params, (err) => {
//         if (err) {
//           console.error('...unable to insert post into db');
//           reject(err);
//         }
//       }).run(
//         'UPDATE users SET postCount = postCount + 1 WHERE userID = ?',
//         [msg.author.id],
//         (err) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve('...post inserted into db at ' + new Date().toString());
//         }
//       );
//     });
//   });
// };

/**
 *
 * @param {object} react the reaction object
 * @param {object} user the user that initiated the reaction
 * @param {boolean} isReactionAdd whether the reaction was added or removed
 * @returns
 */
const updateKarma = async (react, user, isReactionAdd) => {
  let karma = karmaGain(react);
  if (!karma) return;
  if (user.id === react.message.author.id) {
    return;
  }
  if (user.bot) {
    return;
  }
  karma = isReactionAdd ? karma : -1 * karma;

  updateUserKarma(user.id, karma);
  const post = await getPost(react.message.id); // for purpose of checking if the upvote was on a post
  if (post) {
    updatePostKarma(react.message.id, karma);
  }
  console.log(
    `...${user.id} gave ${karma} karma to ${react.message.author.id}`
  );

  // return new Promise((resolve, reject) => {
  //   getPost(react.message.id, db)
  //     .then((row) => {
  //       db.serialize(() => {
  //         db.run(
  //           'UPDATE users SET karma = karma + ? WHERE userID = ?',
  //           [karma, react.message.author.id],
  //           (err) => {
  //             if (err) {
  //               console.error(err.message, err.stack);
  //               reject(err);
  //               return;
  //             }
  //             resolve(
  //               `...user ${user.username} gave ${karma} karma to user ${react.message.author.username}`
  //             );
  //           }
  //         );
  //         if (!row) return; // the purspose of this is to  update the karma on a post in the db
  //         // so if this reaction was on a post, then we update both the user and post karma
  //         // if reaction is not on a post, we only update user karma
  //         db.run(
  //           'UPDATE posts SET upvotes  = upvotes + ? WHERE messageID = ?;',
  //           [karma, row.messageID],
  //           (err) => {
  //             if (err) {
  //               console.error(err.message, err.stack);
  //               reject(err);
  //             }
  //           }
  //         );
  //       });
  //     })
  //     .catch(console.error);
  // });
};

const getMessageData = (react) => {
  const channel = client.channels.cache.get(react.message.channel.id);
  return channel.messages.fetch(react.message.id); // this should return a promise
};

const karmaCommand = async (msg, userID) => {
  // const obj = {};
  // db.get(
  //   'SELECT karma, postCount FROM users WHERE userID = ?',
  //   [msg.author.id],
  //   (err, row) => {
  //     if (err) {
  //       console.error(err.message, err.stack);
  //       return;
  //     }
  //     if (!row) {
  //       obj.err = true;
  //     } else if (row) {
  //       obj.karma = row.karma;
  //       obj.postCount = row.postCount;
  //     } else obj.err = true;
  //     let reply = `You have ${obj.karma} karma and ${obj.postCount} dank meme posts.`;
  //     if (obj.err) {
  //       reply = "There was an error. I'll get back to you later.";
  //     }
  //     msg.reply(reply).then().catch(console.error);
  //   }
  // );

  try {
    let replyMsg = "There was an error. I'll try to get back to you later.";
    const user = await getUser(userID);
    if (user) {
      const { karma, postCount } = user;
      if (karma && postCount) {
        replyMsg = `${user.username} has ${karma} karma and ${postCount} posts.`;
      }
    }
    msg.reply(replyMsg);
  } catch (err) {
    console.error(err.message, err.stack);
  }
};

// const getUserKarmaCommand = (user, db) => {
//   return new Promise((resolve, reject) => {
//     db.get(
//       'SELECT karma, postCount FROM users WHERE userID = ?',
//       [user.id],
//       (err, row) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(row);
//       }
//     );
//   });
// };
// const getUserPosts = (user, db) => {
//   return new Promise((resolve, reject) => {
//     db.get(
//       'SELECT postCount FROM users WHERE userID = ?',
//       [user.id],
//       (err, row) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(row);
//       }
//     );
//   });
// };

const leaderboardFormatter = (users, user, theLimit) => {
  let limit = theLimit;
  users.sort((a, b) => (b.karma > a.karma ? 1 : a.karma > b.karma ? -1 : 0)); // sort decreasing

  const userIndex = users.findIndex((elem) => elem.userID === user.id);
  if (userIndex === -1) return 'Sorry something went wrong :(';
  if (!limit) {
    limit = 3;
  }
  limit = limit < 1 ? 1 : limit;
  limit = Math.min(limit, users.length);
  let leaderboard = `\nLeaderboard:\n\t`;

  for (let i = 0; i < limit; i++) {
    const entry = `${i + 1}. ${users[i].username}\t(${
      users[i].karma
    } karma)\n\t`;
    leaderboard += entry;
  }
  leaderboard += `...\n\t${userIndex + 1}. ${users[userIndex].username}\t(${
    users[userIndex].karma
  })`;
  return leaderboard;
};

client.on('message', async (msg) => {
  try {
    if (msg.author.bot) return;
    if (msg.author.username === 'Artem P.') {
      if (
        msg.content === `${PREFIX}destroy` ||
        msg.content === `${PREFIX}nuke`
      ) {
        client.destroy(process.env.DISCORD_BOT_TOKEN);
        return;
      }
    }

    await insertUser(createUserObj(msg));

    msg.content = msg.content.trim().toLocaleLowerCase();

    const upvoteName = VALID_UPVOTE_ID.find(
      (emoteID) => typeof msg.guild.emojis.cache.get(emoteID) !== 'undefined'
    ); // msg.guild.emojis.cache only has custom emotes
    const downvoteName = VALID_DOWNVOTE_ID.find(
      (emoteID) => typeof msg.guild.emojis.cache.get(emoteID) !== 'undefined'
    );
    const upvote = msg.guild.emojis.cache.get(upvoteName) || DEFAULT_UPVOTE;
    const downvote =
      msg.guild.emojis.cache.get(downvoteName) || DEFAULT_DOWNVOTE;

    if (isMemeChannel(msg) && msgHasOneAttach(msg)) {
      msg.attachments.forEach(async (item) => {
        try {
          const { url } = item;
          if (isImage(url)) {
            let uploadResult;
            await cloud.uploader.upload(url, (res, err) => {
              if (res) {
                uploadResult = JSON.parse(JSON.stringify(res));
              } else if (err) {
                console.error(err.message, err.stack);
              } else throw new Error('Error with uploading file to cloudinary');
            });
            if (await insertPost(createPostObj(msg, uploadResult))) {
              incrementUserPostCount(msg.author.id);
            }
            msg.react(upvote);
            msg.react(downvote);
          }
        } catch (err) {
          console.error(err.message, err.stack);
        }
      });
    }
    /*
    Give users option to upvote or downvote
    */
    if (
      msg.channel.name === 'announcements' ||
      msg.channel.name === 'cool-lectures'
    ) {
      msg.react(upvote);
      msg.react(downvote);
      return;
    }

    if (!msg.content.startsWith(PREFIX)) return; // everything after this point deals with bot commands
    const command = msg.content.split(/\s+/);
    /*
    Karma commands 
     */
    if (command[0] === `${PREFIX}karma`) {
      if (command.length === 1) {
        karmaCommand(msg, msg.author.id);
      } else if (msg.mentions.users && msg.mentions.users.size === 1) {
        msg.mentions.users.each(async (user) => {
          karmaCommand(msg, user.id);
        });
      }
    }
    /*
    Help command
    */
    if (command[0] === `${PREFIX}help`) {
      await msg.reply(
        '\nCommands:\n\t.karma - displays how much karma you have and how many posts you have made\n\t.karma @mention - displays how much karma mentioned user has and how many posts they have made\n\t.rank {number} - displays karma leaderboard (number is optional)'
      );
    }
    /*
    Rank command
    */
    if (command[0] === `${PREFIX}rank`) {
      let limit = command[1];
      if (Number.isNaN(limit)) {
        limit = undefined;
      }
      let replyMsg = 'Sorry there was an issue.';
      const users = await getAllUsers();
      if (users) {
        replyMsg = leaderboardFormatter(users, msg.author, limit);
      }
      msg.reply(replyMsg);
    }
  } catch (err) {
    console.error(err.message, err.stack);
  }
});

client.on('messageReactionAdd', async (react, user) => {
  // react.emoji.id = '864567120469688330'
  // react.emoji.name = 'updoot'
  try {
    if (user.bot) return;
    const msg = await getMessageData(react);
    react.message.author = msg.author;
    if (
      user.id === react.message.author.id &&
      VALID_UPVOTE_ID.includes(react.emoji.id) &&
      !RESTRICTED_CHANNELS.includes(react.message.channel.name)
    ) {
      react.message.reply(`stop upvoting yourself you loser`);
    }
    if (
      user.id === react.message.author.id &&
      VALID_DOWNVOTE_ID.includes(react.emoji.id) &&
      !RESTRICTED_CHANNELS.includes(react.message.channel.name)
    ) {
      react.message.reply(`you hate yourself don't you`);
    }
    await updateKarma(react, user, true);
  } catch (err) {
    console.error(err.message, err.stack);
  }
});

client.on('messageReactionRemove', async (react, user) => {
  // due to a quirk of discordjs or just discord, this will not be emitted by messages that are not cached
  // so if a bot is restarted and the first thing to happen is a reaction is removed, then this will not be emitted
  // this will usually not be a problem
  // what may be a problem is that due to a similar quirk, the 'react' param will be incomplete
  // basically react.message.author will be null
  try {
    if (user.bot) return;
    const msg = await getMessageData(react);
    react.message.author = msg.author;
    await updateKarma(react, user, false);
  } catch (err) {
    console.error(err.message, err.stack);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
