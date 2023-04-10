import { Link } from "react-router-dom";

import Button from "../../components/Button";
import "./authentication.css";

const Authentication = ({
  page,
  children,
  loading,
  onSubmit,
  actionButton,
  location,
}) => {
  return (
    <section className="auth">
      <div className="auth--wrapper">
        <h1 className="auth--title">
          {page} to <span>{"<Blog />"}</span>
        </h1>
        <form className="auth--form" onSubmit={onSubmit}>
          {/* children Form inputs */}
          {children}
          <Button disabled={loading}>{actionButton}</Button>
          <p>
            {page === "Login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              to={`/${page === "login" ? "signup" : "login"}`}
              className="auth--link"
              state={location.state ? { from: location.state.from } : undefined}
              replace={`/${page === "login" ? "signup" : "login"}`}
            >
              {page === "login" ? "Sign up" : "Login"}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Authentication;
