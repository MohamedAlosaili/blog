import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Input from "../../components/Input";
import Authentication from "../Authentication";
import { signupUser } from "../../fetchData";
import { UserContext } from "../../UserContext";

const Signup = () => {
  const [, , , getUserInfo] = useContext(UserContext);
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const [signup, signing] = useSignup(signupInfo, location, getUserInfo);

  const signupLink = (
    <p>
      Already have an account?{" "}
      <Link
        to={`/login`}
        className="auth--link"
        state={location.state ? { from: location.state.from } : undefined}
      >
        Login
      </Link>
    </p>
  );

  return (
    <Authentication
      page={{ name: "Sign up" }}
      loading={signing}
      onSubmit={signup}
      actionButton={signing ? "Signing..." : "Sign up"}
      links={signupLink}
    >
      <Input
        label="Name"
        type="text"
        name="name"
        required={true}
        placeholder="Ali"
        value={signupInfo.name}
        setValue={setSignupInfo}
      />
      <Input
        label="Username"
        type="text"
        name="username"
        required={true}
        placeholder="e.g. user-123"
        value={signupInfo.username}
        setValue={setSignupInfo}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        required={true}
        placeholder="example@gmail.com"
        value={signupInfo.email}
        setValue={setSignupInfo}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        required={true}
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
        value={signupInfo.password}
        setValue={setSignupInfo}
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        required={true}
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
        value={signupInfo.confirmPassword}
        setValue={setSignupInfo}
      />
    </Authentication>
  );
};

function useSignup(signupInfo, location, getUserInfo) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `<Blog /> | Sign up`;
  }, []);

  async function signup(event) {
    event.preventDefault();
    const { confirmPassword, ...restInfo } = signupInfo;

    if (restInfo.password !== confirmPassword) {
      return toast.error("Password doesn't match!");
    }

    setLoading(true);
    try {
      const result = await signupUser(JSON.stringify(restInfo));
      if (!result.success) {
        setLoading(false);
        return toast.error(result.error);
      }

      await getUserInfo(result.token);

      const navigateTo = location.state ? location.state.from : "/";
      navigate(navigateTo, { replace: navigateTo });

      setLoading(false);
      toast.success("Signed up successfuly", { autoClose: 1000 });
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.message);
    }
  }

  return [signup, loading];
}

export default Signup;
