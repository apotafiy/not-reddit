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
  };
  return (
    <div>
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
      </div>
    </div>
  );
};

export default UserList;
