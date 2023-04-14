import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Authentication from "../Authentication";
import Input from "../../components/Input";
import { resetPassword } from "../../fetchData";
import { UserContext } from "../../UserContext";

const ResetPassword = () => {
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    document.title = `<Blog /> | Reset Password`;
  }, []);

  const [resetPasswordHandler, loading] = useResetPassword(
    passwordRef,
    confirmPasswordRef
  );

  return (
    <Authentication
      page={{ name: "Reset Password", replace: true }}
      onSubmit={resetPasswordHandler}
      actionButton={loading ? "Resting..." : "Reset"}
    >
      <Input
        inputRef={passwordRef}
        label="New Password"
        type="password"
        name="password"
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
      />
      <Input
        inputRef={confirmPasswordRef}
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
      />
    </Authentication>
  );
};

function useResetPassword(passwordRef, confirmPasswordRef) {
  const [, , , getUserInfo] = useContext(UserContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async event => {
    event.preventDefault();

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      return toast.error("Password doesn't match");
    }

    setLoading(true);

    try {
      const result = await resetPassword(JSON.stringify({ password }), token);

      if (!result.success) {
        setLoading(false);
        return toast.error(result.error);
      }

      const error = await getUserInfo();
      setLoading(false);

      if (error) return toast.error(error);

      navigate("/", { replace: true });

      toast.success("Password Reset", { autoClose: 1000 });
      toast.success("Loggedin successfully", { autoClose: 2000 });
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.message);
    }
  };
  return [resetPasswordHandler, loading];
}

export default ResetPassword;
