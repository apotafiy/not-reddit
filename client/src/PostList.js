import { useState, useEffect } from 'react';
import Post from './Post';

const PostList = () => {
  const db = [
    {
      postID: 1,
      messageID: 1,
      userID: 1,
      publicID: 1,
      version: 1,
      format: 'png',
      resourceType: 'image',
      createdAt: 'time',
      type: 'upload',
      secureURL:
        'https://res.cloudinary.com/dnuch8w9j/image/upload/v1626837602/c8sbdkpyspterqx1ppju.jpg',
      upvotes: 1,
    },
    {
      postID: 2,
      messageID: 2,
      userID: 2,
      publicID: 2,
      version: 2,
      format: 'jpg',
      resourceType: 'image',
      createdAt: 'time',
      type: 'upload',
      secureURL:
        'https://res.cloudinary.com/dnuch8w9j/image/upload/v1627599043/x7tghqkwbvox5hwopn00.png',
      upvotes: 2,
    },
    {
      postID: 3,
      messageID: 3,
      userID: 3,
      publicID: 3,
      version: 3,
      format: 'webp',
      resourceType: 'image',
      createdAt: 'time',
      type: 'upload',
      secureURL:
        'https://res.cloudinary.com/dnuch8w9j/image/upload/v1628193588/uz3m2izf0hwh6h2a3yve.png',
      upvotes: 3,
    },
  ];
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPosts(db);
    }, 2000);
  }, []);

  return (
    <div className="post-list">
      {posts && posts.map((post) => <Post dbData={post} key={post.postID} />)}
    </div>
  );
};

export default PostList;
