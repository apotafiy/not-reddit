import { Card, Container, Row, Col } from 'react-bootstrap';

const User = ({ dbData, index }) => {
  const { username, karma, postcount } = dbData;

  return (
    <div>
      <Card
        style={{
          margin: '1em',
          color: 'white',
          backgroundColor: 'rgb(var(--bs-dark-rgb))',
          boxShadow: '0.3rem 0.3rem 0.3rem rgb(0, 0, 0, 0.4)',
        }}
        body
      >
        <Container>
          <Row>
            <Col>{index}.</Col>

            <Col>Username: {username}</Col>
            <Col>Karma: {karma}</Col>
            <Col>Posts: {postcount}</Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
};

export default User;
