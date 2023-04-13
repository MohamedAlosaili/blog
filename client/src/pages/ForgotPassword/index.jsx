import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useLocation, useNavigate } from "react-router-dom";

import Authentication from "../Authentication";
import MessageBox from "./MessageBox";
import Input from "../../components/Input";
import { forgotPassword } from "../../fetchData";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    document.title = `<Blog /> | Forgot Password`;
  }, []);

  const sendResetPasswordEmail = async event => {
    event.preventDefault();

    const email = emailInputRef.current.value;
    setLoading(true);

    try {
      const result = await forgotPassword(JSON.stringify({ email }));

      setLoading(false);
      if (!result.success) return toast.error(result.error);

      toast.success(result.message);
      navigate("?messagebox=true");
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const showMessageBox = JSON.parse(
    new URLSearchParams(location.search).get("messagebox")
  );

  return (
    <>
      <Authentication
        page={{ name: "Forgot Password", replace: true }}
        actionButton={loading ? "Sending..." : "Send"}
        loading={loading}
        onSubmit={sendResetPasswordEmail}
      >
        <Input
          label="Email"
          inputRef={emailInputRef}
          type="email"
          required={true}
          placeholder="Enter your email"
        />
      </Authentication>
      {showMessageBox && <MessageBox email={emailInputRef.current.value} />}
    </>
  );
};

export default ForgotPassword;
