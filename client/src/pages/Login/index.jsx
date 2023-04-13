import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Input from "../../components/Input";
import Authentication from "../Authentication";
import { loginUser } from "../../fetchData";
import { UserContext } from "../../UserContext";

const Login = () => {
  const [user, userLoading, , getUserInfo] = useContext(UserContext);
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const location = useLocation();
  const [login, logging] = useLogin(loginInfo, location, getUserInfo);

  const loginLinks = (
    <>
      <p>
        Don't have an account?{" "}
        <Link
          to={`/signup`}
          className="auth--link"
          state={location.state ? { from: location.state.from } : undefined}
          replace={`/signup`}
        >
          Sign up
        </Link>
      </p>
      <Link to="/forgotpassword" className="auth--link">
        Forgot your password
      </Link>
    </>
  );

  return (
    <Authentication
      page={{ name: "Login" }}
      loading={logging}
      location={location}
      onSubmit={login}
      actionButton={logging ? "Loggingin..." : "Login"}
      links={loginLinks}
    >
      <Input
        label="Username"
        type="text"
        name="username"
        placeholder="e.g. user-123"
        value={loginInfo.username}
        setValue={setLoginInfo}
        required={true}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
        value={loginInfo.password}
        setValue={setLoginInfo}
        required={true}
      />
    </Authentication>
  );
};

function useLogin(loginInfo, location, getUserInfo) {
  const navigate = useNavigate();
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

  return [login, loading];
}

export default Login;
