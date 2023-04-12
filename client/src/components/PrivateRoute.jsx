import { useContext, useEffect } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";

import { UserContext } from "../UserContext";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useContext(UserContext);
  const post = useLoaderData();

  useEffect(() => {
    let toastId = "private-route-toast";
    if (loading) {
      toast.loading("Loading...", { autoClose: 3000, toastId });
    } else {
      toast.dismiss(toastId);
    }
  }, [loading]);

  const isUserAuthor = user && user?._id === post?.author?._id;

  if (loading) return;

  return isUserAuthor ? (
    children
  ) : (
    <Navigate to={`/posts/${post.id}`} replace={true} />
  );
};

export default PrivateRoute;
