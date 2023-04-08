import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../../components/Button";
import { loginUser } from "../../fetchData";
import "./login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });

  useEffect(() => {
    document.title = `<Blog /> | Login`;
  }, []);

  async function login(event) {
    event.preventDefault();
    const { username, password } = loginInfo;
    if (!username || !password) {
      toast.error("Please enter your login information");
    }

    const result = await loginUser(JSON.stringify(loginInfo));

    if (!result.success) {
      return toast.error(result.error);
    }
    console.log(result);
    const navigateTo = location.state ? location.state : "/";
    navigate(navigateTo, { replace: navigateTo });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  }

  return (
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
          <Button>Login</Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
