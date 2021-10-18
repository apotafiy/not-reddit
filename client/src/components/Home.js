import { Image, Container, Row, Col } from 'react-bootstrap';
import logo from '../reddit-logo.png';
import Bottom from './Bottom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div>
      <Container
        style={{
          position: 'absolute',
          left: '15vw',
          width: '75vw',
          top: '30vh',
        }}
      >
        <Row style={{ columnGap: '6em' }}>
          <Col>
            <div
              className="text-white "
              style={{
                backgroundColor: 'rgb(var(--bs-dark-rgb))',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <h1 className="page-header-title">
                <strong>Welcome to Not Reddit!</strong>
              </h1>
              <p className="page-header-text mb-5">
                To can navigate to my selection of high quality memes you may
                click the <strong>Memes</strong> link at the top of the page.
                The <strong>Users</strong> link at the top of the page will
                navigate to all the Discord users who contributed their own
                hard-earned memes.
              </p>
              <p>
                All these memes and users come from my university Computer
                Science Discord server, which has over 350 members. I built a
                Discord bot to store user data for over 175 users from the
                server and over 350 memes.
              </p>
            </div>
          </Col>
          <Col className="col-lg-6 d-none d-lg-block aos-init aos-animate">
            <Image
              style={{ objectFit: 'contain' }}
              className="App-logo img-fluid"
              src={logo}
              alt="Logo"
            />
          </Col>
        </Row>
      </Container>
      <Bottom></Bottom>
    </div>
  );
};

export default Home;
