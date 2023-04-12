import { useRef, useState } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArticle } from "react-icons/md";

import Editor from "./Editor";
import { createPost, getPost, updatePost } from "../../fetchData";
import "./editPost.css";

export async function loader({ params }) {
  const result = await getPost(params.postId);

  if (!result.success)
    throw new Response("", { status: result.status, statusText: result.error });

  return result.data;
}

const EditPost = () => {
  const oldPost = useLoaderData();
  const location = useLocation();

  const [newPost, setNewPost] = useState({
    title: oldPost?.title || "",
    summary: oldPost?.summary || "",
    tags: oldPost?.tags?.join() || "",
  });
  const [content, setContent] = useState(oldPost?.content || "");
  const fileInputRef = useRef(null);

  const [editPostHandler, loading, navigate] = useEditPost(
    oldPost,
    newPost,
    content,
    fileInputRef
  );

  const handleChange = event => {
    const { name, value } = event.target;

    setNewPost(prevPost => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleCanceling = event => {
    event.preventDefault();
    const navigateTo = location.state ? location.state.from : "/";
    navigate(navigateTo);
  };

  return (
    <section className="edit--post">
      <h1 className="edit--post--title">
        {oldPost ? "Edit Post" : "Create New Post"} <MdArticle />
      </h1>
      <form className="edit--post--form" onSubmit={editPostHandler}>
        <label className="form--label">
          Title
          <input
            type="text"
            name="title"
            className="form--input"
            placeholder="Post title"
            required
            value={newPost.title}
            onChange={handleChange}
          />
        </label>
        <label className="form--label">
          Summary
          <input
            type="text"
            name="summary"
            className="form--input"
            placeholder="Summary of the post content"
            required
            value={newPost.summary}
            onChange={handleChange}
          />
        </label>
        <label className="form-label">
          Cover Image
          <input
            ref={fileInputRef}
            type="file"
            name="coverImage"
            className="form--input"
            placeholder="Cover Image"
            required={!oldPost}
          />
        </label>
        <label className="form-label">
          Tags
          <span className="input--hint--icon">i</span>
          <span className="input--hint--text">
            To add tags, type them one by one and separate each with a comma.
            For example: 'Meditation,Remote Work,Productivity'.
          </span>
          <input
            type="text"
            name="tags"
            className="form--input"
            placeholder="Post tags e.g. Meditation,Remote Work,Productivity"
            required
            value={newPost.tags}
            onChange={handleChange}
          />
        </label>
        <Editor onChange={({ text }) => setContent(text)} value={content} />
        <div className="edit--post--buttons">
          <button
            onClick={handleCanceling}
            className="blog--btn edit--post--cancel"
          >
            Cancel
          </button>
          <button className="blog--btn">
            {oldPost
              ? loading
                ? "Updating post..."
                : "Update Post"
              : loading
              ? "Creating Post..."
              : "Create Post"}
          </button>
        </div>
      </form>
    </section>
  );
};

function useEditPost(oldPost, newPost, content, fileInputRef) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function editPostHandler(event) {
    event.preventDefault();
    const isNewPost = !oldPost;
    setLoading(true);

    const formData = extractFormData(newPost, content, fileInputRef);

    const editMethod = isNewPost ? createPost : updatePost;
    const result = await editMethod(formData, oldPost?.id);

    if (!result.success) {
      setLoading(false);
      return toast.error(result.error);
    }

    toast.success(isNewPost ? "New post created" : "Post updated succesfully", {
      autoClose: 1000,
    });
    navigate(`/posts/${result.data.id}`);
    setLoading(false);
  }

  function extractFormData(newPost, content, fileInputRef) {
    const { title, summary, tags } = newPost;
    const formData = new FormData();

    formData.append("title", title);
    formData.append("summary", summary);
    tags.split(",").forEach(tag => formData.append("tags", tag));
    formData.append("content", content);

    if (fileInputRef.current.files[0])
      formData.append("coverImage", fileInputRef.current.files[0]);

    return formData;
  }

  return [editPostHandler, loading, navigate];
}

export default EditPost;
