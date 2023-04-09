import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../../components/Button";
import { loginUser } from "../../fetchData";
import { UserContext } from "../../UserContext";
import "./login.css";

const Login = () => {
  const [user, userLoading, , getUserInfo] = useContext(UserContext);
  const location = useLocation();
  const { handleChange, login, loginInfo, logging } = useLogin(
    location,
    getUserInfo
  );

  return !user && !userLoading ? (
    <section className="login">
      <div className="login--wrapper">
        <h1 className="login--title">
          Login to <span>{"<Blog />"}</span>
        </h1>
        <form className="login--form" onSubmit={login}>
          <label className="login--label">
            Username
            <input
              type="text"
              name="username"
              placeholder="e.g. user-123"
              className="login--input"
              value={loginInfo.username}
              onChange={handleChange}
            />
          </label>
          <label className="login--label">
            Password
            <input
              type="password"
              name="password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              className="login--input"
              value={loginInfo.password}
              onChange={handleChange}
            />
          </label>
          <Button disabled={logging}>
            {logging ? "Loggingin..." : "Login"}
          </Button>
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="login--signup--link"
              state={location.state ? { from: location.state.from } : undefined}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  ) : (
    <Navigate to="/" />
  );
};

function useLogin(location, getUserInfo) {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `<Blog /> | Login`;
  }, []);

  async function login(event) {
    event.preventDefault();
    const { username, password } = loginInfo;

    if (!username || !password) {
      return toast.error("Please enter your login information");
    }

    setLoading(true);

    try {
      const result = await loginUser(JSON.stringify(loginInfo));

      // Update user context
      await getUserInfo();

      setLoading(false);
      if (!result.success) {
        return toast.error(result.error);
      }
      const navigateTo = location.state ? location.state.from : "/";
      navigate(navigateTo, { replace: navigateTo });

      toast.success("Loggedin successfully", { autoClose: 1000 });
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  }

  return { handleChange, login, loginInfo, logging: loading };
}

export default Login;
