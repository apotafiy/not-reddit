import Home from './components/Home';
import PostList from './components/PostList';
import MyNavbar from './components/Navbar';
import UserList from './components/UserList';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <div className="App">
      <MyNavbar />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/memes">
            <PostList />
          </Route>
          <Route path="/users">
            <UserList />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
