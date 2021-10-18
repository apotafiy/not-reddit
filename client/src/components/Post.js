import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const Post = ({ dbData }) => {
  const { username, createdat, secureurl, upvotes } = dbData;

  const [span, setSpan] = useState(null);

  async function fetchData() {
    const img = new Image();
    img.addEventListener('load', function () {
      const width = this.naturalWidth;
      const height = this.naturalHeight;
      const newSpan = Math.floor((height / width) * 26) + 22; // random formula that seems to work ok
      setSpan(newSpan);
    });
    img.src = secureurl;
  }
  fetchData();

  const outerStyles = {
    margin: '10px 10px',
    padding: '0',
    gridRowEnd: `span ${span ? span : '26'}`,
  };

  return (
    <div style={outerStyles} className="post">
      <Card
        style={{
          boxShadow: '0.3rem 0.3rem 0.3rem rgb(0, 0, 0, 0.4)',
          borderWidth: '1px',
          borderColor: 'rgb(170,170,170)',
          backgroundColor: 'rgba(var(--bs-dark-rgb))',
        }}
      >
        <Card.Img variant="top" src={secureurl} />
        <Card.Body style={{ color: 'white' }}>
          <Card.Text>{`User: ${username}`}</Card.Text>
          <Card.Text>{`Upload date: ${createdat}`}</Card.Text>
          <Card.Text>{`Upvotes: ${upvotes}`}</Card.Text>
          <Button
            onClick={(e) => {
              e.preventDefault();
              window.open(secureurl, '_blank');
            }}
            variant="secondary"
            style={{
              backgroundColor: 'RGBA(255, 67, 0)',
              borderColor: 'white',
            }}
          >
            Full Image
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
