import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Authentication from "../Authentication";
import { loginUser } from "../../fetchData";
import { UserContext } from "../../UserContext";

const Login = () => {
  const [user, userLoading, , getUserInfo] = useContext(UserContext);
  const location = useLocation();
  const { handleChange, login, loginInfo, logging } = useLogin(
    location,
    getUserInfo
  );

  return (
    <Authentication
      page="login"
      loading={logging}
      location={location}
      onSubmit={login}
      actionButton={logging ? "Loggingin..." : "Login"}
    >
      <label className="form--label">
        Username
        <input
          type="text"
          name="username"
          placeholder="e.g. user-123"
          className="form--input"
          value={loginInfo.username}
          onChange={handleChange}
        />
      </label>
      <label className="form--label">
        Password
        <input
          type="password"
          name="password"
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          className="form--input"
          value={loginInfo.password}
          onChange={handleChange}
        />
      </label>
    </Authentication>
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

      if (!result.success) {
        setLoading(false);
        return toast.error(result.error);
      }

      // Update user context
      await getUserInfo();

      const navigateTo = location.state ? location.state.from : "/";
      navigate(navigateTo, { replace: navigateTo });

      toast.success("Loggedin successfully", { autoClose: 1000 });
      setLoading(false);
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
