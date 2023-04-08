import { Link } from "react-router-dom";

const Post = ({ post }) => (
  <article className="post">
    <img
      src={post.coverImage}
      alt={`${post.title} cover`}
      className="post--img"
    />
    <div className="post--text">
      <Link to={`posts/${post._id}`}>
        <h1 className="post--title">{post.title}</h1>
      </Link>
      <p className="post--date">Published On: {formatDate(post.createdAt)}</p>
      <div>
        {post.tags.map(tag => (
          <span key={tag} className="post--tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="post--summary">{post.summary}</p>
      <Link to={`posts/${post._id}`} className="post--link">
        Read more
      </Link>
    </div>
  </article>
);

function formatDate(date) {
  const formatedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formatedDate;
}

export default Post;

/*
{
    "_id": "642bf7a89a37d2294d6d096b",
    "title": "The Benefits of Meditation for Mental Health",
    "coverImage": "https://example.com/images/meditation-cover.jpg",
    "summary": "Meditation is a powerful tool for improving mental health. In this article, we'll explore the benefits of meditation and provide tips for getting started.",
    "tags": [
        "meditation",
        "mental health",
        "wellness"
    ],
    "likes": 0,
    "author": {
        "_id": "642b39d6a0889c1ea1f7eb38",
        "name": "Ali",
        "username": "ali"
    },
    "createdAt": "2023-04-05T20:34:09.184Z",
    "updatedAt": "2023-04-05T20:34:09.184Z",
    "slug": "the-benefits-of-meditation-for-mental-health",
    "__v": 0,
    "id": "642bf7a89a37d2294d6d096b"
}
*/
