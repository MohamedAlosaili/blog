import { useState } from "react";
import {
  Form,
  redirect,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { BsExclamationCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

import { deletePost } from "../../../fetchData";
import "./deletePost.css";

export async function action({ params }) {
  const result = await deletePost(params.postId);

  if (!result.success)
    throw new Response("", { status: result.status, statusText: result.error });

  toast.success("Post deleted successfully", { autoClose: 1000 });
  return redirect("/");
}

const DeletePost = () => {
  const navigate = useNavigate();
  const { title } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const cancelDeleting = event => {
    event.preventDefault();
    !loading && navigate(-1);
  };

  return (
    <div className="delete--post">
      <div className="delete--post--layer" onClick={cancelDeleting}></div>
      <Form
        method="DELETE"
        className="delete--post--form"
        onSubmit={() => setLoading(true)}
      >
        <BsExclamationCircleFill size={75} color="rgba(255, 0, 0, 0.75)" />
        <p>Are you sure you want to delete "{title}" post?</p>
        <div className="buttons--wrapper">
          <button
            onClick={cancelDeleting}
            className="blog--btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="blog--btn delete--post--confirm"
            disabled={loading}
          >
            {loading ? "Deleting..." : "I'm sure"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default DeletePost;
