import { useState, useEffect } from 'react';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedPosts = await fetch('/api/db/posts');
      const fetchedUsers = await fetch('/api/db/users');
      const postsData = await fetchedPosts.json();
      postsData.sort((a, b) => a.createdat.localeCompare(b.createdat)); // sort newest
      const usersData = await fetchedUsers.json();
      const idNameMap = {}; // map userID and usernames
      usersData.forEach((user) => {
        if (idNameMap[user.userid] === undefined) {
          idNameMap[user.userid] = user.username;
        }
      });

      postsData.splice(0, postsData.length - 20);
      postsData.forEach((post) => {
        post.username = idNameMap[post.userid];
      });

      postsData.reverse();
      setPosts(postsData);
    }
    fetchData();
  }, []);

  const outerStyles = {
    margin: '0',
    padding: '0',
    width: '85vw',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 250px)',
    gridAutoRows: '10px',
    justifyContent: 'center',
  };

  return (
    <div style={outerStyles} className="post-list">
      <div>Sort by most popular, controversial, newest, oldest</div>
      {posts
        ? posts.map((post) => <Post dbData={post} key={post.postid} />)
        : 'Loading...'}
    </div>
  );
};

export default PostList;
