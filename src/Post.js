const Post = ({ dbData }) => {
  const { username, createdat, secureurl, karma } = dbData;
  return (
    <div className="post">
      <img src={secureurl} alt="Dank Meme" />
      <div className="post-info">
        <p className="user-name">{`user: ${username}`}</p>
        <p className="created-at">{`created at: ${createdat}`}</p>
        <p className="karma">{`karma: ${karma}`}</p>
      </div>
    </div>
  );
};

export default Post;
