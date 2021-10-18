import { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import User from './User.js';

const UserList = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await fetch('/api/db/users');
      const usersData = await fetchedUsers.json();
      usersData.sort((a, b) => b.karma - a.karma);
      console.log('Total users:', usersData.length);
      setUsers(usersData);
    }
    fetchData();
  }, []);

  function sortPop() {
    users.sort((a, b) => b.karma - a.karma);
    setUsers([...users]);
  }

  function sortCont() {
    users.sort((a, b) => a.karma - b.karma);
    setUsers([...users]);
  }

  const outerStyles = {
    margin: '0px 50px 0px 50px',
    paddingBottom: '2.5em',
  };
  return (
    <div style={{ paddingBottom: '2.5em' }}>
      <DropdownButton
        variant="secondary"
        id="dropdown-basic-button"
        title="Sort by"
        style={{ margin: '25px 50px 25px 50px' }}
      >
        <Dropdown.Item onClick={sortPop}>Popular</Dropdown.Item>
        <Dropdown.Item onClick={sortCont}>Controversial</Dropdown.Item>
      </DropdownButton>
      <div style={outerStyles} className="user-list">
        {users
          ? users.map((user, i) => <User index={i} dbData={user} key={i} />)
          : 'Loading...'}
      </div>
    </div>
  );
};

export default UserList;
