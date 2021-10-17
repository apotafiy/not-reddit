//import './App.css';
import Home from './components/Home';
import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import logo from './reddit-logo.png';
import './index.css';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container className="ms-1">
          <Navbar.Brand href="#home">
            <Image
              className="reddit-logo ms-1 App-logo"
              src={logo}
              alt="Logo"
              height="32px"
            />
            <strong className="ms-2">Not Reddit</strong>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link className="ms-3 me-2" href="#home">
              Home
            </Nav.Link>
            <Nav.Link className="me-2" href="#features">
              Memes
            </Nav.Link>
            <Nav.Link className="me-2" href="#pricing">
              Users
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Home />
    </div>
  );
}

export default App;
