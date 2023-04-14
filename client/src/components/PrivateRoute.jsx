import { useContext } from "react";
import { Navigate, useLoaderData } from "react-router-dom";
import { CgSpinnerTwo } from "react-icons/cg";

import { UserContext } from "../UserContext";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useContext(UserContext);
  const post = useLoaderData();

  if (loading)
    return (
      <div className="loading--spinner--container">
        <CgSpinnerTwo className="loading--spinner" size={50} />
      </div>
    );

  const isUserAuthor = user && user?._id === post?.author?._id;

  return isUserAuthor ? (
    children
  ) : (
    <Navigate to={`/posts/${post.id}`} replace={true} />
  );
};

export default PrivateRoute;
