import Home from './components/Home';
import PostList from './components/PostList';
import MyNavbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="App">
      <MyNavbar />
      <Home />
      <PostList />
    </div>
  );
}

export default App;
