import { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import Post from './Post';

const PostList = (userid) => {
  const [posts, setPosts] = useState(null);

  const [postCount, setPostCount] = useState(20);

  const [sort, setSort] = useState('pop');

  useEffect(() => {
    async function fetchData(userid) {
      const fetchedPosts = await fetch('/api/db/posts');
      const fetchedUsers = await fetch('/api/db/users');
      let postsData = await fetchedPosts.json();
      const usersData = await fetchedUsers.json();
      const idNameMap = {}; // map userID and usernames
      usersData.forEach((user) => {
        if (idNameMap[user.userid] === undefined) {
          idNameMap[user.userid] = user.username;
        }
      });

      postsData.forEach((post) => {
        post.username = idNameMap[post.userid];
      });

      if (userid) {
        postsData = postsData.filter((post) => post.userid === userid);
      }

      getSort(sort, postsData);
      if (postCount > 0) {
        postsData.splice(0, postsData.length - postCount); // removes from 0 up to that point
      }
      postsData.reverse(); // so posts come in correct order

      setPosts(postsData);
    }
    console.log('fetching');

    fetchData();
  }, [postCount, sort]);

  function getSort(type, posts) {
    function sortPop(posts) {
      posts.sort((a, b) => a.upvotes - b.upvotes);
    }
    function sortCont(posts) {
      posts.sort((a, b) => b.upvotes - a.upvotes);
    }
    function sortNew(posts) {
      posts.sort((a, b) => a.createdat.localeCompare(b.createdat)); // sort newest
    }
    function sortOld(posts) {
      posts.sort((a, b) => b.createdat.localeCompare(a.createdat));
    }
    if (type === 'cont') {
      sortCont(posts);
    } else if (type === 'new') {
      sortNew(posts);
    } else if (type === 'old') {
      sortOld(posts);
    } else {
      sortPop(posts);
    }
  }

  const outerStyles = {
    margin: '100px 0px 0px 0px',
    padding: '0',
    width: '85vw',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 260px)',
    gridAutoRows: '10px',
    justifyContent: 'center',
  };

  return (
    <div>
      <div style={{ marginTop: '1em', position: 'absolute', left: '15vw' }}>
        <Container>
          <Row>
            <Col>
              <DropdownButton
                variant="secondary"
                id="dropdown-basic-button"
                title="Sort by"
              >
                <Dropdown.Item
                  onClick={() => {
                    setSort('pop');
                  }}
                >
                  Popular
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSort('cont');
                  }}
                >
                  Controversial
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSort('new');
                  }}
                >
                  Newest
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSort('old');
                  }}
                >
                  Oldest
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col>
              <DropdownButton
                variant="secondary"
                id="dropdown-basic-button"
                title="View #"
              >
                <Dropdown.Item onClick={() => setPostCount(20)}>
                  20
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPostCount(50)}>
                  50
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPostCount(100)}>
                  100
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPostCount(-1)}>
                  All {'(Be careful Icarus)'}
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Container>
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
