import { Component } from "react";
import { BsExclamationCircleFill } from "react-icons/bs";

class ErrorBoundary extends Component {
  state = {
    error: null,
    hasError: false,
  };

  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <BsExclamationCircleFill size={75} color="rgba(255, 0, 0, 0.85)" />
          <h1 className="error--title">Oops! Something went wrong.</h1>
          <p className="error--text">
            There was an error while processing your request.
          </p>
          <p className="error--text">Please try again later.</p>
          <p className="error--text red">
            {this.state.error.message || this.state.error.toString()}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
