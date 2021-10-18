import { useState, useEffect } from 'react';
import Bottom from './Bottom';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import Post from './Post';

const PostList = (userid) => {
  const SORT_POPULAR = 'SORT_POPULAR';
  const SORT_CONTROVERSIAL = 'SORT_CONTROVERSIAL';
  const SORT_NEW = 'SORT_NEW';
  const SORT_OLD = 'SORT_OLD';

  const [totalPosts, setTotalPosts] = useState(null);

  const [posts, setPosts] = useState(null);

  const [postCount, setPostCount] = useState(20);

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

      postsSort(postsData, SORT_POPULAR);

      setTotalPosts(postsData);
      console.log('Total memes:', postsData.length);

      // if i ever choose to have individual user pages
      // maybe no need for this idk
      // if (userid) {
      //   postsData = postsData.filter((post) => post.userid === userid);
      // }

      const displayPosts = postsData.slice(0, 20); // copies from 0 up to that point
      //displayPosts.reverse(); // so posts come in correct order

      setPosts(displayPosts);
    }
    console.log('fetching');

    fetchData();
  }, []);

  function postsSort(arr, type) {
    function sortPop(arr) {
      arr.sort((a, b) => b.upvotes - a.upvotes);
    }
    function sortCont(arr) {
      arr.sort((a, b) => a.upvotes - b.upvotes);
    }
    function sortNew(arr) {
      arr.sort((a, b) => b.createdat.localeCompare(a.createdat)); // sort newest
    }
    function sortOld(arr) {
      arr.sort((a, b) => a.createdat.localeCompare(b.createdat));
    }
    if (type === SORT_CONTROVERSIAL) {
      sortCont(arr);
    } else if (type === SORT_NEW) {
      sortNew(arr);
    } else if (type === SORT_OLD) {
      sortOld(arr);
    } else {
      sortPop(arr);
    }
    //console.log(arr);
  }

  function onSortBy(type) {
    postsSort(totalPosts, type);
    setPosts(totalPosts.slice(0, postCount));
  }

  function onChangeCount(count) {
    setPostCount(count);
    setPosts(totalPosts.slice(0, count ? count : totalPosts.length));
  }

  const outerStyles = {
    margin: '100px 0px 0px 0px',
    padding: '0em 0em 2.5em 0em',
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
                    onSortBy(SORT_POPULAR);
                  }}
                >
                  Popular
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onSortBy(SORT_CONTROVERSIAL);
                  }}
                >
                  Controversial
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onSortBy(SORT_NEW);
                  }}
                >
                  Newest
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onSortBy(SORT_OLD);
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
                <Dropdown.Item
                  onClick={() => {
                    onChangeCount(20);
                  }}
                >
                  20
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onChangeCount(50);
                  }}
                >
                  50
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onChangeCount(100);
                  }}
                >
                  100
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    onChangeCount();
                  }}
                >
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
        <Bottom></Bottom>
      </div>
    </div>
  );
};

export default PostList;
