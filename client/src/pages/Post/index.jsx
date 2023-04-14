import { useContext, useEffect, useRef, useState } from "react";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import Balancer from "react-wrap-balancer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-toastify";

import formatDate from "../../formatDate";
import Comment from "./Comment";
import {
  getPost,
  addComment,
  updateComment,
  deleteComment,
} from "../../fetchData";
import { UserContext } from "../../UserContext";
import "./post.css";

export async function loader({ params }) {
  const result = await getPost(params.postId);

  if (!result.success)
    throw new Response("", { status: result.status, statusText: result.error });

  return result.data;
}

export async function action({ request, params }) {
  const formData = await request.formData();

  switch (request.method) {
    case "POST":
      await addCommentAction(formData, params.postId);
      break;
    case "PUT":
      await updateCommentAction(formData);
      break;
    case "DELETE":
      await deleteCommentAction(formData);
      break;
  }

  return { success: true };
}

const commentBoxDefaultValue = { type: "new", commentId: undefined, value: "" };

const Post = () => {
  const [user] = useContext(UserContext);
  const post = useLoaderData();
  const actionState = useActionData();
  const navigation = useNavigation();
  const commentFieldRef = useRef(null);
  const [commentBox, setCommentBox] = useState(commentBoxDefaultValue);

  useEffect(() => {
    document.title = `<Blog /> | ${post.title}`;
  }, []);

  useEffect(() => {
    if (actionState?.success) {
      if (commentBox.type === "edit") setCommentBox(commentBoxDefaultValue);
      commentFieldRef.current.value = "";
    }
  }, [actionState]);

  const cancelEditComment = e => {
    e.preventDefault();
    setCommentBox(commentBoxDefaultValue);
  };

  const commentFormLoading =
    (navigation.formMethod === "put" || navigation.formMethod === "post") &&
    navigation.state !== "idle";

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
        <footer className="post--comments">
          <h2>Comments</h2>
          <section className="post--comments--container">
            {post.comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                user={user}
                setCommentBox={setCommentBox}
                commentFieldRef={commentFieldRef}
              />
            ))}
            {user ? (
              <Form
                method={commentBox.type === "edit" ? "PUT" : "POST"}
                className="post--comments--form"
                id="comments-form"
                key={commentBox.type}
              >
                <>
                  <h3>
                    {commentBox.type === "new"
                      ? "Leave a comment"
                      : "Edit your comment"}
                  </h3>
                  <textarea
                    ref={commentFieldRef}
                    name="comment"
                    className="comments--form--input"
                    placeholder="Write a comment"
                    required
                    defaultValue={commentBox.value}
                  />
                  <div className="post--comments--form--buttons">
                    {commentBox.type === "edit" && (
                      <button
                        onClick={cancelEditComment}
                        className="blog--btn cancel"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="blog--btn"
                      name={commentBox?.commentId ? "commentId" : ""}
                      value={commentBox?.commentId ? commentBox.commentId : ""}
                    >
                      {commentBox.type === "new"
                        ? commentFormLoading && navigation.formMethod !== "put"
                          ? "Sending..."
                          : "Send comment"
                        : commentFormLoading
                        ? "Updating..."
                        : "Update comment"}
                    </button>
                  </div>
                </>
              </Form>
            ) : (
              <p className="post--comments--form">
                To write a comment, please{" "}
                <Link
                  to="/login"
                  state={{ from: `/posts/${post.id}` }}
                  className="login--link"
                >
                  Login
                </Link>{" "}
                to your account.
              </p>
            )}
          </section>
        </footer>
      </article>
      <Outlet context={{ title: post.title }} />
    </div>
  );
};

async function addCommentAction(formData, postId) {
  const comment = formData.get("comment");

  const result = await addComment(JSON.stringify({ content: comment }), postId);

  if (!result.success) return toast.error(result.error);

  toast.success("Comment added", { autoClose: 1000 });
}

async function updateCommentAction(formData) {
  const comment = formData.get("comment");
  const commentId = formData.get("commentId");

  const result = await updateComment(
    JSON.stringify({ content: comment }),
    commentId
  );

  if (!result.success) return toast.error(result.error);

  toast.success("Comment has been Updated");
}

async function deleteCommentAction(formData) {
  const commentId = formData.get("commentId");

  const result = await deleteComment(commentId);

  if (!result.success) return toast.error(result.error);

  toast.success("Comment has been deleted");
}

export default Post;
