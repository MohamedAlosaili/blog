import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

import "./errorPage.css";
import Button from "../../components/Button";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "";
    document.title = `<Blog /> | ${error.statusText}`;
  }, []);

  console.log(error);

  return (
    <div className="error">
      <h1 className="error--code">{error.status}</h1>
      <h2>Oops, something went wrong!</h2>
      <p className="error--text">
        We're sorry, but an error occurred while processing your request.
      </p>
      <p className="error--text red">
        Error: {error.error?.message || error.statusText || error.message}
      </p>
      <Button onClick={() => navigate(-1)}>Previous page</Button>
    </div>
  );
};

export default ErrorPage;
