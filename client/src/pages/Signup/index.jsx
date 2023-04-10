import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Authentication from "../Authentication";
import { signupUser } from "../../fetchData";
import { UserContext } from "../../UserContext";

const Signup = () => {
  const [user, userLoading, , getUserInfo] = useContext(UserContext);
  const location = useLocation();
  const { handleChange, signup, signupInfo, signing } = useSignup(
    location,
    getUserInfo
  );

  return (
    <Authentication
      page="signup"
      loading={signing}
      location={location}
      onSubmit={signup}
      actionButton={signing ? "Signing..." : "Sign up"}
    >
      <label className="form--label">
        Name
        <input
          type="text"
          name="name"
          required
          placeholder="Ali"
          className="form--input"
          value={signupInfo.name}
          onChange={handleChange}
        />
      </label>
      <label className="form--label">
        Username
        <input
          type="text"
          name="username"
          required
          placeholder="e.g. user-123"
          className="form--input"
          value={signupInfo.username}
          onChange={handleChange}
        />
      </label>
      <label className="form--label">
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="example@gmail.com"
          className="form--input"
          value={signupInfo.email}
          onChange={handleChange}
        />
      </label>
      <label className="form--label">
        Password
        <input
          type="password"
          name="password"
          required
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          className="form--input"
          value={signupInfo.password}
          onChange={handleChange}
        />
      </label>
      <label className="form--label">
        Confirm Password
        <input
          type="password"
          name="confirmPassword"
          required
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          className="form--input"
          value={signupInfo.confirmPassword}
          onChange={handleChange}
        />
      </label>
    </Authentication>
  );
};

function useSignup(location, getUserInfo) {
  const navigate = useNavigate();
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  async function signup(event) {
    event.preventDefault();
    const { confirmPassword, ...restInfo } = signupInfo;

    if (restInfo.password !== confirmPassword) {
      return toast.error("Password doesn't match!");
    }

    setLoading(true);
    try {
      const result = await signupUser(JSON.stringify(restInfo));
      console.log(restInfo);
      if (!result.success) {
        setLoading(false);
        return toast.error(result.error);
      }

      await getUserInfo();

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

  function handleChange(event) {
    const { name, value } = event.target;

    setSignupInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  }

  return { handleChange, signup, signupInfo, signing: loading };
}

export default Signup;
