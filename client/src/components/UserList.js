import { useState, useEffect } from 'react';
import Bottom from './Bottom.js';
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
    width: '70vw',
    position: 'absolute',
    left: '15vw',
    paddingBottom: '2.5em',
  };
  return (
    <div style={{ paddingBottom: '2.5em' }}>
      <DropdownButton
        variant="secondary"
        id="dropdown-basic-button"
        title="Sort by"
        style={{ postion: 'absolute', left: '15vw', margin: '1em 0em' }}
      >
        <Dropdown.Item onClick={sortPop}>Popular</Dropdown.Item>
        <Dropdown.Item onClick={sortCont}>Controversial</Dropdown.Item>
      </DropdownButton>
      <div style={outerStyles} className="user-list">
        {users
          ? users.map((user) => <User dbData={user} key={user.userid} />)
          : 'Loading...'}
        <Bottom />
      </div>
    </div>
  );
};

export default UserList;
