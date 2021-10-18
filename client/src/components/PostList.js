import { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Post from './Post';

const PostList = (userid) => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function fetchData(userid) {
      const fetchedPosts = await fetch('/api/db/posts');
      const fetchedUsers = await fetch('/api/db/users');
      let postsData = await fetchedPosts.json();
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

      if (userid) {
        postsData = postsData.filter((post) => post.userid === userid);
      }

      postsData.reverse();
      setPosts(postsData);
    }
    console.log('fetching');
    fetchData();
  }, []);

  const outerStyles = {
    margin: '50px 0px 0px 0px',
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

  function sortPop() {
    posts.sort((a, b) => b.upvotes - a.upvotes);
    setPosts([...posts]);
  }
  function sortCont() {
    posts.sort((a, b) => a.upvotes - b.upvotes);
    setPosts([...posts]);
  }
  function sortNew() {
    posts.sort((a, b) => b.createdat.localeCompare(a.createdat)); // sort newest
    setPosts([...posts]);
  }
  function sortOld() {
    posts.sort((a, b) => a.createdat.localeCompare(b.createdat));
    setPosts([...posts]);
  }

  return (
    <div>
      <div style={{ marginTop: '1em', position: 'absolute', left: '15vw' }}>
        <DropdownButton
          variant="secondary"
          id="dropdown-basic-button"
          title="Sort by"
        >
          <Dropdown.Item onClick={sortPop}>Popular</Dropdown.Item>
          <Dropdown.Item onClick={sortCont}>Controversial</Dropdown.Item>
          <Dropdown.Item onClick={sortNew}>Newest</Dropdown.Item>
          <Dropdown.Item onClick={sortOld}>Oldest</Dropdown.Item>
        </DropdownButton>
      </div>
      <div style={outerStyles} className="post-list">
        {posts
          ? posts.map((post) => <Post dbData={post} key={post.messageid} />)
          : 'Loading...'}
      </div>
    </div>
  );
};

export default PostList;
