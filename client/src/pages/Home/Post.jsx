import { Link } from "react-router-dom";

import formatDate from "../../formatDate";

const Post = ({ post }) => (
  <article className="home--post">
    <img
      src={post.coverImage}
      alt={`${post.title} cover`}
      className="home--post--img"
    />
    <div className="home--post--text">
      <Link to={`posts/${post._id}`}>
        <h1 className="home--post--title">{post.title}</h1>
      </Link>
      <p className="home--post--date">
        Published On: {formatDate(post.createdAt)}
      </p>
      <div>
        {post.tags.map(tag => (
          <span key={tag} className="home--post--tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="home--post--summary">{post.summary}</p>
      <Link to={`posts/${post._id}`} className="link">
        Read more
      </Link>
    </div>
  </article>
);

export default Post;
