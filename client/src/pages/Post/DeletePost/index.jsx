import {
  Form,
  redirect,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { BsExclamationCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
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

  const cancelDeleting = event => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <div className="delete--post">
      <div className="delete--post--layer" onClick={cancelDeleting}></div>
      <Form method="DELETE" className="delete--post--form">
        <BsExclamationCircleFill size={75} color="rgba(255, 0, 0, 0.75)" />
        <p>Are you sure you want to delete "{title}" post?</p>
        <div className="buttons--wrapper">
          <Button onClick={cancelDeleting}>Cancel</Button>
          <Button className="delete--post--confirm">I'm sure</Button>
        </div>
      </Form>
    </div>
  );
};

export default DeletePost;