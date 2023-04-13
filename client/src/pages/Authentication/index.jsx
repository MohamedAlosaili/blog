import { Link } from "react-router-dom";

import "./authentication.css";

const Authentication = ({
  page,
  children,
  loading,
  onSubmit,
  actionButton,
  links,
}) => (
  <section className="auth">
    <div className="auth--wrapper">
      <h1 className="auth--title">
        {page.replace ? (
          page.name
        ) : (
          <>
            {page.name} to <span>{"<Blog />"}</span>
          </>
        )}
      </h1>
      <form className="auth--form" onSubmit={onSubmit}>
        {/* children Form inputs */}
        {children}
        <button disabled={loading} className="blog--btn">
          {actionButton}
        </button>
        {links}
      </form>
    </div>
  </section>
);

export default Authentication;
