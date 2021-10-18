import { Navbar, Container, Nav, Image } from 'react-bootstrap';
import logo from '../reddit-logo.png';

function MyNavbar() {
  return (
    <Navbar expand="md" bg="dark" variant="dark">
      <Container className="ms-1">
        <Navbar.Brand href="/">
          <Image
            className="reddit-logo ms-1 App-logo"
            src={logo}
            alt="Logo"
            height="32px"
          />
          <strong className="ms-2">Not Reddit</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="me-2 nav-link-main" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="me-2 nav-link-main" href="/memes">
              Memes
            </Nav.Link>
            <Nav.Link className="me-2 nav-link-main" href="/users">
              Users
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
