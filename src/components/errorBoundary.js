// ErrorBoundary.js
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to external service here
    // console.error("Uncaught error:", error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-modal-backdrop">
          <div className="error-modal">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.toString()}</p>
            <button onClick={this.handleClose}>Dismiss</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
