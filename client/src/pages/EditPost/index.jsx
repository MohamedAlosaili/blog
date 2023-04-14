import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArticle } from "react-icons/md";

import Input from "../../components/Input";
import Editor from "./Editor";
import { createPost, getPost, updatePost } from "../../fetchData";
import { UserContext } from "../../UserContext";
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
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Post title"
          required={true}
          value={newPost.title}
          setValue={setNewPost}
        />
        <Input
          label="Summary"
          type="text"
          name="summary"
          placeholder="Summary of the post content"
          required={true}
          value={newPost.summary}
          setValue={setNewPost}
        />
        <Input
          label="Cover Image"
          inputRef={fileInputRef}
          type="file"
          name="coverImage"
          placeholder="Cover Image"
          required={!oldPost}
        />
        <Input
          label="Tags"
          type="text"
          name="tags"
          placeholder="Post tags e.g. Meditation,Remote Work,Productivity"
          required={true}
          value={newPost.tags}
          setValue={setNewPost}
        />
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
  const [user, userLoading] = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect user if he logged out in create post page
    if (!userLoading && !user && !oldPost) {
      navigate("/", { replace: true });
    }
  }, [user]);

  async function editPostHandler(event) {
    event.preventDefault();
    const isNewPost = !oldPost;
    setLoading(true);

    const formData = extractFormData(newPost, content, fileInputRef);

    try {
      const editMethod = isNewPost ? createPost : updatePost;
      const result = await editMethod(formData, oldPost?.id);

      if (!result.success) {
        setLoading(false);
        return toast.error(result.error);
      }

      toast.success(
        isNewPost ? "New post created" : "Post updated succesfully",
        {
          autoClose: 1000,
        }
      );
      navigate(`/posts/${result.data.id}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
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
