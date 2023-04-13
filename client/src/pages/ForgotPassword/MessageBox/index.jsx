import emailSent from "/mail_sent.svg";
import "./messageBox.css";

const MessageBox = ({ email }) => (
  <div className="message--box--container">
    <div className="message--box">
      <img
        src={emailSent}
        alt="Email sent icon"
        className="message--box--img"
      />
      <p className="message--box--text">
        An email has been sent to your email address <strong>{email}</strong>{" "}
        with a link to reset your password. Please check your inbox and follow
        the link provided to complete the password reset process.
      </p>
    </div>
  </div>
);

export default MessageBox;
