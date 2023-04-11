import { useContext } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import Balancer from "react-wrap-balancer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import formatDate from "../../formatDate";
import { getPost } from "../../fetchData";
import { UserContext } from "../../UserContext";
import "./post.css";

export async function loader({ params }) {
  const result = await getPost(params.postId);

  if (!result.success)
    throw new Response("", { status: result.status, statusText: result.error });

  return { post: result.data };
}

const Post = () => {
  const [user] = useContext(UserContext);
  const { post } = useLoaderData();
  console.log(post, user);

  return (
    <div className="post">
      <article>
        <header>
          <h1 className="post--title">
            <Balancer>{post.title}</Balancer>
          </h1>
          <div className="post--info--wrapper">
            <p className="post--info">
              {formatDate(post.createdAt)} • By{" "}
              <Link to="" className="link">
                {post.author.name}
              </Link>
            </p>
            {user?._id === post.author._id && (
              <>
                <Link
                  to={`/posts/${post.id}/edit`}
                  state={{ from: `/posts/${post.id}` }}
                  className="post--edit--button"
                >
                  Edit Post
                </Link>
                <Link to="delete" className="post--delete--button">
                  Delete Post
                </Link>
              </>
            )}
          </div>
          {post.tags.map(tag =>
            tag ? (
              <span key={tag} className="post--tag">
                {tag}
              </span>
            ) : undefined
          )}
        </header>
        <main>
          <figure className="post--coverimage">
            <img
              src={post.coverImage}
              alt={`${post.title} article cover image`}
            />
            <figcaption>{post.title}</figcaption>
          </figure>
          <ReactMarkdown className="post--content" remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </main>
      </article>
      <Outlet context={{ title: post.title }} />
    </div>
  );
};

export default Post;
