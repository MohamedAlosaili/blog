import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { CgSpinnerTwo } from "react-icons/cg";

import { UserContext } from "../UserContext";

const RedirectUser = ({ children }) => {
  const [user, loading] = useContext(UserContext);
  const location = useLocation();

  if (loading)
    return (
      <div className="loading--spinner--container">
        <CgSpinnerTwo className="loading--spinner" size={50} />
      </div>
    );

  const navigateTo = location.state ? location.state.from : "/";

  return user ? <Navigate to={navigateTo} replace={true} /> : children;
};

export default RedirectUser;
