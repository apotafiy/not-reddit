import PostList from './PostList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="Container">
      <PostList />
    </div>
  );
};

export default Home;
