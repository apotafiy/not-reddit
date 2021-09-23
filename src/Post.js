const Post = ({ dbData }) => {
  const { userName, createdAt, secureURL, karma } = dbData;
  return (
    <div className="post">
      <img src={secureURL} alt="Dank Meme" />
      <div className="post-info">
        <p className="user-name">{`user: ${userName}`}</p>
        <p className="created-at">{`created at: ${createdAt}`}</p>
        <p className="karma">{`karma: ${karma}`}</p>
      </div>
    </div>
  );
};

export default Post;
